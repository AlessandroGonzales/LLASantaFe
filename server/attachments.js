import { Buffer } from "node:buffer";
import { inflateRawSync } from "node:zlib";
import { FILE_TYPES, MAX_FILE_BYTES, FormError } from "../shared/forms.js";

const invalid = () => new FormError("El contenido del archivo no corresponde a un documento permitido.");

// Se inspecciona el directorio ZIP antes de descomprimir: límites contra ZIP bombs.
function inspectZip(bytes) {
  let end = -1;
  for (let i = bytes.length - 22; i >= Math.max(0, bytes.length - 65557); i--) {
    if (bytes.readUInt32LE(i) === 0x06054b50 && i + 22 + bytes.readUInt16LE(i + 20) === bytes.length) { end = i; break; }
  }
  if (end < 0 || bytes.readUInt16LE(end + 4) || bytes.readUInt16LE(end + 6)) throw invalid();
  const count = bytes.readUInt16LE(end + 10);
  if (count < 1 || count > 500 || count !== bytes.readUInt16LE(end + 8)) throw invalid();
  let cursor = bytes.readUInt32LE(end + 16);
  const directoryEnd = cursor + bytes.readUInt32LE(end + 12);
  if (directoryEnd !== end) throw invalid();
  let total = 0;
  const entries = new Map();
  for (let n = 0; n < count; n++) {
    if (cursor + 46 > end || bytes.readUInt32LE(cursor) !== 0x02014b50) throw invalid();
    const flags = bytes.readUInt16LE(cursor + 8);
    const method = bytes.readUInt16LE(cursor + 10);
    const packed = bytes.readUInt32LE(cursor + 20);
    const size = bytes.readUInt32LE(cursor + 24);
    const nameLength = bytes.readUInt16LE(cursor + 28);
    const next = cursor + 46 + nameLength + bytes.readUInt16LE(cursor + 30) + bytes.readUInt16LE(cursor + 32);
    if (next > end || flags & 1 || ![0, 8].includes(method)) throw invalid();
    const name = bytes.subarray(cursor + 46, cursor + 46 + nameLength).toString("utf8");
    if (/\\|(^|\/)\.\.(\/|$)|^\/|vbaProject|\.exe$|\.js$|\.vbs$/i.test(name) || entries.has(name)) throw invalid();
    total += size;
    if (total > 20 * 1024 * 1024 || size > 10 * 1024 * 1024 || size > Math.max(packed, 1) * 300) throw invalid();
    const local = bytes.readUInt32LE(cursor + 42);
    if (local + 30 > directoryEnd || bytes.readUInt32LE(local) !== 0x04034b50) throw invalid();
    const start = local + 30 + bytes.readUInt16LE(local + 26) + bytes.readUInt16LE(local + 28);
    if (start + packed > bytes.readUInt32LE(end + 16)) throw invalid();
    if (bytes.subarray(local + 30, local + 30 + bytes.readUInt16LE(local + 26)).toString("utf8") !== name) throw invalid();
    entries.set(name, { method, start, packed, size });
    cursor = next;
  }
  if (cursor !== directoryEnd) throw invalid();
  return {
    has: (name) => entries.has(name),
    read(name) {
      const entry = entries.get(name);
      if (!entry || entry.size > 256 * 1024) throw invalid();
      const raw = bytes.subarray(entry.start, entry.start + entry.packed);
      const result = entry.method === 0 ? raw : inflateRawSync(raw, { maxOutputLength: 256 * 1024 });
      if (result.length !== entry.size) throw invalid();
      return result.toString("utf8");
    },
  };
}

export function validateAttachment(input) {
  if (!input.fileData && !input.fileName && !input.fileType) return null;
  if (typeof input.fileData !== "string" || input.fileData.length > Math.ceil(MAX_FILE_BYTES / 3) * 4 ||
      input.fileData.length % 4 !== 0 || !/^[A-Za-z0-9+/]*={0,2}$/.test(input.fileData)) {
    throw new FormError("El archivo supera 2 MB o no pudo leerse correctamente.");
  }
  if (typeof input.fileName !== "string" || input.fileName.length > 180) throw invalid();
  // eslint-disable-next-line no-control-regex -- Los nombres almacenados no admiten caracteres de control.
  const filename = input.fileName.normalize("NFC").replace(/[\u0000-\u001f\u007f/\\<>:"|?*]/g, "_").trim();
  const ext = filename.split(".").pop().toLowerCase();
  if (!Object.hasOwn(FILE_TYPES, ext)) throw invalid();
  const bytes = Buffer.from(input.fileData, "base64");
  if (!bytes.length || bytes.length > MAX_FILE_BYTES || bytes.toString("base64") !== input.fileData) throw invalid();
  try {
    if (ext === "pdf") {
      if (!bytes.subarray(0, 8).toString("ascii").startsWith("%PDF-") ||
          !bytes.subarray(-2048).includes(Buffer.from("%%EOF"))) throw invalid();
    } else if (ext === "doc" || ext === "xls") {
      if (bytes.length < 512 || !bytes.subarray(0, 8).equals(Buffer.from("d0cf11e0a1b11ae1", "hex"))) throw invalid();
      // CFB clásico: distinguir documentos de otros contenedores OLE.
      const stream = Buffer.from(ext === "doc" ? "WordDocument" : "Workbook", "utf16le");
      if (!bytes.includes(stream) && !(ext === "xls" && bytes.includes(Buffer.from("Book", "utf16le")))) throw invalid();
    } else if (ext === "txt") {
      new TextDecoder("utf-8", { fatal: true }).decode(bytes);
      if (bytes.includes(0)) throw invalid();
    } else {
      const zip = inspectZip(bytes);
      if (ext === "odt") {
        if (zip.read("mimetype") !== FILE_TYPES.odt || !zip.has("content.xml")) throw invalid();
      } else {
        const types = zip.read("[Content_Types].xml");
        const expected = ext === "docx" ? "word/document.xml" : "xl/workbook.xml";
        const mainType = ext === "docx"
          ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"
          : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml";
        if (!zip.has(expected) || !types.includes(mainType) || /macroEnabled|vbaProject/i.test(types)) throw invalid();
      }
    }
  } catch { throw invalid(); }
  // No se confía en el MIME proporcionado por el navegador.
  return { name: filename, mimeType: FILE_TYPES[ext], size: bytes.length, base64: bytes.toString("base64") };
}

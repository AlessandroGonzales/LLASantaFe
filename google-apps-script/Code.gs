/*
 * Ejecutar bajo oficial@llasantafe.com.ar.
 * Propiedades del script: API_SECRET, SPREADSHEET_ID, UPLOAD_FOLDER_ID.
 * setupWorkspace() crea la planilla y carpeta una sola vez.
 * Las solicitudes públicas requieren una firma HMAC del servidor.
 */
const HEADERS = {
  sumate: ["id", "created_at", "fingerprint", "schema_version", "estado",
    "nombre", "dni", "whatsapp", "localidad", "quiere_fiscalizar", "consentimiento_version"],
  propone: ["id", "created_at", "fingerprint", "schema_version", "estado",
    "nombre", "telefono", "email", "profesion", "motivo", "mensaje",
    "archivo_id", "archivo_url", "archivo_nombre", "archivo_mime", "archivo_bytes"],
};
const TAB_NAMES = { sumate: "Sumate", propone: "Propuestas" };

function setupWorkspace() {
  const account = Session.getEffectiveUser().getEmail();
  if (account !== "oficial@llasantafe.com.ar") {
    throw new Error("Ejecutá esta configuración desde oficial@llasantafe.com.ar.");
  }
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const properties = PropertiesService.getScriptProperties();
    const secret = properties.getProperty("API_SECRET");
    if (!secret || secret.length < 32) throw new Error("Configurá primero API_SECRET en las propiedades del script.");
    let spreadsheetId = properties.getProperty("SPREADSHEET_ID");
    if (!spreadsheetId) {
      const created = SpreadsheetApp.create("LLA Santa Fe - Formularios web");
      spreadsheetId = created.getId();
      properties.setProperty("SPREADSHEET_ID", spreadsheetId);
      created.getSheets()[0].setName(TAB_NAMES.sumate);
    }
    const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    DriveApp.getFileById(spreadsheetId).setSharing(DriveApp.Access.PRIVATE, DriveApp.Permission.NONE);
    spreadsheet.setSpreadsheetTimeZone("America/Argentina/Buenos_Aires");
    Object.keys(HEADERS).forEach(function (kind) {
      let sheet = spreadsheet.getSheetByName(TAB_NAMES[kind]);
      if (!sheet) sheet = spreadsheet.insertSheet(TAB_NAMES[kind]);
      if (sheet.getLastRow() === 0) {
        sheet.getRange(1, 1, 1, HEADERS[kind].length).setValues([HEADERS[kind]]);
        sheet.setFrozenRows(1);
      }
      assertHeaders_(sheet, kind);
    });
    let folderId = properties.getProperty("UPLOAD_FOLDER_ID");
    if (!folderId) {
      const folder = DriveApp.createFolder("LLA Santa Fe - Documentos recibidos");
      folder.setSharing(DriveApp.Access.PRIVATE, DriveApp.Permission.NONE);
      folderId = folder.getId();
      properties.setProperty("UPLOAD_FOLDER_ID", folderId);
    }
    DriveApp.getFolderById(folderId).setSharing(DriveApp.Access.PRIVATE, DriveApp.Permission.NONE);
    // No registrar claves ni datos de personas.
    console.log("Planilla: " + spreadsheet.getUrl());
    console.log("Carpeta privada: https://drive.google.com/drive/folders/" + folderId);
  } finally { lock.releaseLock(); }
}

function doGet() {
  return json_({ ok: false, code: "method_not_allowed" });
}

function doPost(event) {
  let lock;
  try {
    const properties = PropertiesService.getScriptProperties();
    const secret = properties.getProperty("API_SECRET");
    if (!secret || secret.length < 32) throw new Error("configuration");
    const raw = event && event.postData && event.postData.contents;
    if (typeof raw !== "string" || raw.length > 4 * 1024 * 1024) throw new Error("payload");
    const envelope = JSON.parse(raw);
    if (typeof envelope.timestamp !== "string" || !/^\d{13}$/.test(envelope.timestamp) ||
        Math.abs(Date.now() - Number(envelope.timestamp)) > 300000 ||
        typeof envelope.payload !== "string" || !/^[a-f0-9]{64}$/.test(envelope.signature || "")) {
      throw new Error("authentication");
    }
    const signature = Utilities.computeHmacSha256Signature(
      envelope.timestamp + "." + envelope.payload, secret, Utilities.Charset.UTF_8,
    ).map(function (byte) { return (byte & 255).toString(16).padStart(2, "0"); }).join("");
    if (!constantEquals_(signature, envelope.signature)) throw new Error("authentication");
    const submission = JSON.parse(envelope.payload);
    if (submission.schemaVersion !== 1 || !Object.prototype.hasOwnProperty.call(HEADERS, submission.kind) ||
        !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(submission.requestId || "") ||
        !/^[a-f0-9]{64}$/.test(submission.fingerprint || "") ||
        !submission.data || typeof submission.data !== "object" ||
        !Number.isFinite(Date.parse(submission.receivedAt))) throw new Error("payload");

    lock = LockService.getScriptLock();
    if (!lock.tryLock(10000)) return json_({ ok: false, code: "busy" });
    const spreadsheet = SpreadsheetApp.openById(properties.getProperty("SPREADSHEET_ID"));
    const sheet = spreadsheet.getSheetByName(TAB_NAMES[submission.kind]);
    assertHeaders_(sheet, submission.kind);
    const lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      const previous = sheet.getRange(2, 1, lastRow - 1, 1).createTextFinder(submission.requestId).matchEntireCell(true).findNext();
      if (previous) {
        const fingerprint = sheet.getRange(previous.getRow(), 3).getValue();
        if (fingerprint !== submission.fingerprint) throw new Error("id_conflict");
        return json_({ ok: true, id: submission.requestId });
      }
      // Evita filas y archivos duplicados aunque se cambie el identificador de envío.
      const sameContent = sheet.getRange(2, 3, lastRow - 1, 1).createTextFinder(submission.fingerprint).matchEntireCell(true).findNext();
      if (sameContent) return json_({ ok: true, id: sheet.getRange(sameContent.getRow(), 1).getValue() });
    }

    const values = {
      id: submission.requestId, created_at: submission.receivedAt,
      fingerprint: submission.fingerprint, schema_version: 1, estado: "pendiente",
      nombre: literal_(submission.data.nombre),
    };
    if (submission.kind === "sumate") {
      values.dni = identifier_(submission.data.dni);
      values.whatsapp = identifier_(submission.data.whatsapp);
      values.localidad = literal_(submission.data.localidad);
      values.quiere_fiscalizar = submission.data.quiereFiscalizar === true;
      values.consentimiento_version = "contacto-whatsapp-v1";
    } else {
      ["email", "profesion", "motivo", "mensaje"].forEach(function (key) {
        values[key] = literal_(submission.data[key]);
      });
      values.telefono = identifier_(submission.data.telefono);
      const folder = DriveApp.getFolderById(properties.getProperty("UPLOAD_FOLDER_ID"));
      let file = null;
      if (submission.attachment) {
        const attachment = submission.attachment;
        const bytes = Utilities.base64Decode(attachment.base64);
        if (!bytes.length || bytes.length > 2 * 1024 * 1024 || bytes.length !== attachment.size ||
            typeof attachment.name !== "string" || attachment.name.length > 180 ||
            /[\u0000-\u001f/\\]/.test(attachment.name)) throw new Error("attachment");
        const filename = submission.requestId + "_" + attachment.name;
        const existingFiles = folder.getFilesByName(filename);
        // Un reintento recupera el archivo si falló la escritura de la fila.
        file = existingFiles.hasNext() ? existingFiles.next() :
          folder.createFile(Utilities.newBlob(bytes, attachment.mimeType, filename));
        file.setSharing(DriveApp.Access.PRIVATE, DriveApp.Permission.NONE);
        values.archivo_id = file.getId();
        values.archivo_url = file.getUrl();
        values.archivo_nombre = literal_(attachment.name);
        values.archivo_mime = attachment.mimeType;
        values.archivo_bytes = bytes.length;
      }
      // La ficha también existe para propuestas sin documento adjunto.
      saveProposalDetails_(folder, submission, file);
    }
    const row = HEADERS[submission.kind].map(function (key) {
      return values[key] === undefined ? "" : values[key];
    });
    if (lastRow >= sheet.getMaxRows()) sheet.insertRowsAfter(sheet.getMaxRows(), 100);
    sheet.getRange(lastRow + 1, 1, 1, row.length).setValues([row]);
    SpreadsheetApp.flush();
    return json_({ ok: true, id: submission.requestId });
  } catch {
    // No filtrar excepciones de Google, documentos, IDs privados ni datos personales.
    return json_({ ok: false, code: "save_failed" });
  } finally {
    if (lock && lock.hasLock()) lock.releaseLock();
  }
}

function saveProposalDetails_(folder, submission, attachmentFile) {
  const professions = {
    estudiante: "Estudiante", comerciante: "Comerciante / Pyme",
    empresario: "Emprendedor / Empresario", salud: "Profesional de la Salud",
    docente: "Docente / Investigador", agro: "Sector Agropecuario",
    independiente: "Trabajador Independiente", jubilado: "Jubilado", otro: "Otro",
  };
  const reasons = {
    proyecto: "Proyecto / Propuesta formal", sugerencia: "Sugerencia para la provincia",
    duda: "Duda o Consulta general", voluntariado: "Voluntario / Fiscal",
    denuncia: "Denuncia / Irregularidad",
  };
  const data = submission.data;
  // Texto plano: no interpretar como HTML ni como fórmulas el mensaje recibido.
  const text = [
    "PROPUESTA RECIBIDA - LLA SANTA FE",
    "ID: " + submission.requestId,
    "Fecha de recepción (UTC): " + submission.receivedAt,
    "", "DATOS DEL REMITENTE",
    "Nombre y apellido: " + data.nombre,
    "Teléfono: " + data.telefono,
    "Email: " + data.email,
    "Profesión / Ocupación: " + (professions[data.profesion] || data.profesion),
    "Motivo: " + (reasons[data.motivo] || data.motivo),
    "", "MENSAJE", data.mensaje,
    "", "DOCUMENTO ADJUNTO",
    attachmentFile ? "Archivo: " + attachmentFile.getName() : "Sin documento adjunto.",
    attachmentFile ? "Enlace privado: " + attachmentFile.getUrl() : "",
  ].join("\n");
  // El punto después del UUID evita colisiones con UUID_nombre del adjunto.
  const filename = submission.requestId + ".ficha-propuesta.txt";
  const existing = folder.getFilesByName(filename);
  const details = existing.hasNext() ? existing.next() :
    folder.createFile(Utilities.newBlob(text, "text/plain", filename));
  details.setSharing(DriveApp.Access.PRIVATE, DriveApp.Permission.NONE);
  // Repara reintentos parciales sin crear otra ficha.
  details.setContent(text);
  if (attachmentFile) {
    attachmentFile.setSharing(DriveApp.Access.PRIVATE, DriveApp.Permission.NONE);
    attachmentFile.setDescription(text + "\n\nFicha de la propuesta: " + details.getUrl());
  }
  return details;
}

// Ejecutar MANUALMENTE desde el editor para completar los envíos históricos.
// Procesa hasta 25 filas por ejecución y conserva el avance ante un fallo.
function restoreExistingProposalDetails() {
  if (Session.getEffectiveUser().getEmail() !== "oficial@llasantafe.com.ar") {
    throw new Error("Ejecutá esta recuperación desde oficial@llasantafe.com.ar.");
  }
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const properties = PropertiesService.getScriptProperties();
    const spreadsheet = SpreadsheetApp.openById(properties.getProperty("SPREADSHEET_ID"));
    const sheet = spreadsheet.getSheetByName(TAB_NAMES.propone);
    assertHeaders_(sheet, "propone");
    const folder = DriveApp.getFolderById(properties.getProperty("UPLOAD_FOLDER_ID"));
    const start = Number(properties.getProperty("PROPOSAL_DETAILS_NEXT_ROW") || 2);
    if (!Number.isInteger(start) || start < 2) throw new Error("invalid_recovery_cursor");
    const end = Math.min(sheet.getLastRow(), start + 24);
    for (let row = start; row <= end; row++) {
      // getDisplayValues recupera el texto visible, sin los escapes de Sheets.
      const cells = sheet.getRange(row, 1, 1, HEADERS.propone.length).getDisplayValues()[0];
      const record = {};
      HEADERS.propone.forEach(function (key, index) { record[key] = cells[index]; });
      if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(record.id) ||
          ["nombre", "telefono", "email", "profesion", "motivo", "mensaje"].some(function (key) { return !record[key]; })) {
        throw new Error("Faltan datos en la fila " + row + ". Revisá Sheets antes de continuar.");
      }
      const file = record.archivo_id ? DriveApp.getFileById(record.archivo_id) : null;
      saveProposalDetails_(folder, {
        requestId: record.id, receivedAt: record.created_at, data: record,
      }, file);
      properties.setProperty("PROPOSAL_DETAILS_NEXT_ROW", String(row + 1));
    }
    console.log(end < sheet.getLastRow()
      ? "Lote completado. Volvé a ejecutar restoreExistingProposalDetails para continuar."
      : "Fichas completadas hasta la última fila disponible.");
  } finally { lock.releaseLock(); }
}

function assertHeaders_(sheet, kind) {
  if (!sheet) throw new Error("sheet_missing");
  const headers = sheet.getRange(1, 1, 1, HEADERS[kind].length).getValues()[0];
  if (JSON.stringify(headers) !== JSON.stringify(HEADERS[kind])) throw new Error("schema_mismatch");
}

function constantEquals_(a, b) {
  if (typeof b !== "string" || a.length !== b.length) return false;
  let difference = 0;
  for (let i = 0; i < a.length; i++) difference |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return difference === 0;
}

function literal_(value) {
  if (typeof value !== "string" || value.length > 10000) throw new Error("field");
  // Bloquea fórmulas en Sheets. Volver a sanitizar al exportar a CSV/Excel.
  return /^[\s]*[=+@-]/.test(value) ? "'" + value : value;
}

function identifier_(value) {
  if (typeof value !== "string" || value.length > 32) throw new Error("identifier");
  return "'" + value;
}

function json_(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);
}

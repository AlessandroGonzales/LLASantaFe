export const MAX_FILE_BYTES = 2 * 1024 * 1024;
export const MAX_BODY_BYTES = 3 * 1024 * 1024;
export const FILE_TYPES = {
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  xls: "application/vnd.ms-excel",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  odt: "application/vnd.oasis.opendocument.text",
  txt: "text/plain",
};
export const FILE_ACCEPT = Object.keys(FILE_TYPES).map((extension) => `.${extension}`).join(",");
export const PROFESSIONS = ["estudiante", "comerciante", "empresario", "salud", "docente", "agro", "independiente", "jubilado", "otro"];
export const REASONS = ["proyecto", "sugerencia", "duda", "voluntariado", "denuncia"];
// Una sola dirección: evita listas de destinatarios e inyección de cabeceras.
export const EMAIL_PATTERN = /^[a-z0-9.!#$%&'*+/=?^_{|}~-]+@[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)+$/i;

export class FormError extends Error {
  constructor(message, status = 400, code = "invalid_request") {
    super(message);
    this.name = "FormError";
    this.status = status;
    this.code = code;
  }
}

export function textField(value, label, max, min = 1, multiline = false) {
  if (typeof value !== "string") throw new FormError(`Revisá el campo ${label}.`);
  const text = value.normalize("NFC").trim();
  // eslint-disable-next-line no-control-regex -- Rechazar explícitamente caracteres de control en entradas públicas.
  const forbidden = multiline ? /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/ : /[\u0000-\u001f\u007f]/;
  if (text.length < min || text.length > max || forbidden.test(text)) {
    throw new FormError(`Revisá ${label}: debe tener entre ${min} y ${max} caracteres.`);
  }
  return text;
}

function phone(value) {
  const text = textField(value, "teléfono", 32);
  if (!/^\+?[\d ()-]+$/.test(text) || !/^\d{8,15}$/.test(text.replace(/\D/g, ""))) {
    throw new FormError("Ingresá un teléfono válido con código de área.");
  }
  return text;
}

export function emailField(value) {
  const email = textField(value, "correo electrónico", 254).toLowerCase();
  if (!EMAIL_PATTERN.test(email)) throw new FormError("Ingresá un correo electrónico válido.");
  return email;
}

export function validateFields(kind, input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) throw new FormError("Formulario inválido.");
  const nombre = textField(input.nombre, "nombre y apellido", 120, 2);
  if (kind === "sumate") {
    const dni = textField(input.dni, "DNI", 8, 7);
    if (!/^\d{7,8}$/.test(dni)) throw new FormError("Ingresá un DNI de 7 u 8 números, sin puntos.");
    if (typeof input.quiereFiscalizar !== "boolean") throw new FormError("Revisá la opción de fiscalización.");
    return { nombre, dni, whatsapp: phone(input.whatsapp), localidad: textField(input.localidad, "localidad", 120, 2), quiereFiscalizar: input.quiereFiscalizar, email: emailField(input.email) };
  }
  if (kind !== "propone") throw new FormError("Formulario desconocido.");
  const email = emailField(input.email);
  if (!PROFESSIONS.includes(input.profesion) || !REASONS.includes(input.motivo)) {
    throw new FormError("Seleccioná una profesión y un motivo válidos.");
  }
  return {
    nombre, telefono: phone(input.telefono), email,
    profesion: input.profesion, motivo: input.motivo,
    mensaje: textField(input.mensaje, "mensaje", 10000, 10, true),
  };
}

export function validateFileSelection(file) {
  if (!file) return;
  const extension = file.name.split(".").pop().toLowerCase();
  if (!Object.hasOwn(FILE_TYPES, extension)) {
    throw new FormError("Adjuntá un PDF, Word, Excel, ODT o TXT. No se admiten archivos con extensión de macros.");
  }
  if (!file.size || file.size > MAX_FILE_BYTES) {
    throw new FormError("El documento debe tener contenido y pesar como máximo 2 MB.");
  }
  if (file.name.length > 180) throw new FormError("El nombre del archivo es demasiado largo.");
}

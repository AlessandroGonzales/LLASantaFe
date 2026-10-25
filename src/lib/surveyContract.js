import { ApiError } from "./apiClient.js";

export const surveyQuestionHelp = Object.freeze({ texto: "Escribí tu respuesta", numero: "Ingresá un valor numérico", opcion_unica: "Elegí una opción", opcion_multiple: "Podés elegir varias opciones" });
const validText = (value, max) => typeof value === "string" && value.trim().length > 0 && value.length <= max && !value.includes("\0") && !/[\uD800-\uDFFF]/u.test(value);
const contractError = () => new ApiError("Esta encuesta no tiene un formato compatible. Podés consultar otras encuestas; no se enviaron respuestas.", { code: "survey_configuration" });
function properties(value, allowed) {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw contractError();
  const result = Object.create(null);
  for (const [key, item] of Object.entries(value)) {
    const name = key.toLowerCase();
    if (!allowed.includes(name) || Object.hasOwn(result, name)) throw contractError();
    result[name] = item;
  }
  return result;
}
export function parseSurveyConfiguration(value) {
  const root = properties(value, ["version", "preguntas"]);
  if (root.version !== 1 || !Array.isArray(root.preguntas) || root.preguntas.length < 1 || root.preguntas.length > 50 || new TextEncoder().encode(JSON.stringify(value)).length > 32768) throw contractError();
  const ids = new Set();
  const preguntas = root.preguntas.map(item => {
    const p = properties(item, ["id", "texto", "tipo", "obligatoria", "min", "max", "maxlongitud", "opciones"]);
    if (!validText(p.id, 64) || ids.has(p.id) || !validText(p.texto, 500) || !Object.hasOwn(surveyQuestionHelp, p.tipo) || (p.obligatoria !== undefined && typeof p.obligatoria !== "boolean")) throw contractError();
    ids.add(p.id);
    if (p.maxlongitud != null && (!Number.isInteger(p.maxlongitud) || p.maxlongitud < 1 || p.maxlongitud > 2000)) throw contractError();
    if ([p.min, p.max].some(bound => bound != null && (typeof bound !== "number" || !Number.isFinite(bound))) || (p.min != null && p.max != null && p.min > p.max)) throw contractError();
    if ((p.tipo !== "texto" && p.maxlongitud != null) || (p.tipo !== "numero" && (p.min != null || p.max != null))) throw contractError();
    let opciones;
    if (["opcion_unica", "opcion_multiple"].includes(p.tipo)) {
      if (!Array.isArray(p.opciones) || p.opciones.length < 2 || p.opciones.length > 20) throw contractError();
      const optionIds = new Set();
      opciones = p.opciones.map(item => {
        const option = properties(item, ["id", "texto"]);
        if (!validText(option.id, 64) || !validText(option.texto, 300) || optionIds.has(option.id)) throw contractError();
        optionIds.add(option.id); return Object.freeze({ id: option.id, texto: option.texto });
      });
    } else if (p.opciones != null) throw contractError();
    return Object.freeze({ id: p.id, texto: p.texto, tipo: p.tipo, obligatoria: p.obligatoria ?? false,
      ...(p.tipo === "texto" ? { maxLongitud: p.maxlongitud ?? 2000 } : {}),
      ...(p.min != null ? { min: p.min } : {}), ...(p.max != null ? { max: p.max } : {}),
      ...(opciones ? { opciones: Object.freeze(opciones) } : {}) });
  });
  return Object.freeze({ version: 1, preguntas: Object.freeze(preguntas) });
}

// Compara el decimal introducido con el JSON que enviará JavaScript. Impide
// redondear silenciosamente cifras como 9007199254740993 o decimales muy largos.
function decimalParts(raw) {
  const [base, exponent = "0"] = raw.toLowerCase().split("e");
  const negative = base.startsWith("-");
  const fraction = base.split(".")[1]?.length || 0;
  let digits = base.replace(/[-+.]/g, "").replace(/^0+/, ""), power = Number(exponent) - fraction;
  if (!digits) return { key: "0", digits: "0", power: 0 };
  while (digits.endsWith("0")) { digits = digits.slice(0, -1); power++; }
  return { key: `${negative ? "-" : ""}${digits}e${power}`, digits, power };
}
export function surveyNumber(raw) {
  if (typeof raw !== "string" || raw.length > 100 || !/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/.test(raw.trim())) throw new Error("Ingresá un número válido.");
  const text = raw.trim(), number = Number(text);
  if (!Number.isFinite(number)) throw new Error("El número está fuera del rango admitido.");
  const parts = decimalParts(text);
  if (parts.key !== decimalParts(JSON.stringify(number)).key || parts.power < -28 || parts.digits.length + Math.max(0, parts.power) > 29 ||
      BigInt(parts.digits + "0".repeat(Math.max(0, parts.power))) > 79228162514264337593543950335n)
    throw new Error("Ese número tiene más cifras o precisión de la admitida. Usá menos cifras o decimales.");
  return number;
}
export function surveyAnswerPresent(question, value) {
  if (question.tipo === "opcion_multiple") return Array.isArray(value) && value.length > 0;
  return typeof value === "string" && value.trim().length > 0;
}
export function buildSurveyAnswers(configuration, values) {
  const { preguntas } = parseSurveyConfiguration(configuration), answers = Object.create(null), errors = Object.create(null);
  if (!values || typeof values !== "object" || Array.isArray(values) || Object.keys(values).some(id => !preguntas.some(p => p.id === id))) throw new Error("Las respuestas no corresponden a esta encuesta.");
  for (const p of preguntas) {
    const value = Object.hasOwn(values, p.id) ? values[p.id] : undefined;
    if (!surveyAnswerPresent(p, value)) {
      if (p.obligatoria) errors[p.id] = "Completá esta pregunta para continuar.";
      else if (value != null && !(typeof value === "string" && value.trim() === "") && !(p.tipo === "opcion_multiple" && Array.isArray(value) && value.length === 0)) errors[p.id] = "Revisá el tipo de respuesta.";
      continue;
    }
    try {
      if (p.tipo === "texto") {
        if (!validText(value, p.maxLongitud)) throw new Error(`Escribí hasta ${p.maxLongitud} caracteres, sin caracteres inválidos.`);
        answers[p.id] = value;
      } else if (p.tipo === "numero") {
        const number = surveyNumber(value);
        if ((p.min !== undefined && number < p.min) || (p.max !== undefined && number > p.max)) throw new Error(`Revisá el rango indicado para esta pregunta.`);
        answers[p.id] = number;
      } else {
        const selected = p.tipo === "opcion_multiple" ? value : [value];
        if (selected.length > 20 || new Set(selected).size !== selected.length || selected.some(id => !p.opciones.some(option => option.id === id))) throw new Error("Elegí opciones válidas de esta pregunta.");
        answers[p.id] = p.tipo === "opcion_multiple" ? [...selected] : value;
      }
    } catch (error) { errors[p.id] = error.message; }
  }
  if (Object.keys(errors).length) throw new ApiError("Revisá las preguntas indicadas antes de enviar.", { code: "survey_validation", errors });
  if (!Object.keys(answers).length) throw new Error("Respondé al menos una pregunta antes de enviar.");
  const body = { respuestas: answers };
  if (new TextEncoder().encode(JSON.stringify(body)).length > 65536) throw new Error("Las respuestas son demasiado extensas. Reducí el texto antes de enviar.");
  return body;
}

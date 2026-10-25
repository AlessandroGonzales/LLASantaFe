import { useId } from "react";
import { surveyQuestionHelp } from "../../lib/surveyContract.js";

function Limits({ question }) {
  if (question.tipo === "texto") return <span>Hasta {question.maxLongitud} caracteres.</span>;
  if (question.tipo !== "numero") return null;
  if (question.min !== undefined && question.max !== undefined) return <span>Entre {question.min} y {question.max}. Se admiten decimales.</span>;
  return <span>{question.min !== undefined ? `Mínimo ${question.min}. ` : ""}{question.max !== undefined ? `Máximo ${question.max}. ` : ""}Se admiten decimales.</span>;
}
export function SurveyPreview({ questions }) {
  return <ol className="sv-questions sv-preview">{questions.map((question, index) => <li key={question.id}>
    <div className="sv-question-top"><span className="sv-number">{String(index + 1).padStart(2, "0")}</span><span>{question.obligatoria ? "Obligatoria" : "Opcional"}</span></div>
    <h3>{question.texto}</h3><p className="sv-help">{surveyQuestionHelp[question.tipo]}. <Limits question={question} /></p>
    {question.opciones && <ul className="sv-preview-options">{question.opciones.map(option => <li key={option.id}><span aria-hidden="true" />{option.texto}</li>)}</ul>}
  </li>)}</ol>;
}
export function SurveyQuestion({ question, index, value, error, onChange }) {
  const fieldId = useId(), helpId = `${fieldId}-help`, errorId = `${fieldId}-error`;
  const description = `${helpId}${error ? ` ${errorId}` : ""}`;
  return <fieldset className={`sv-question${error ? " sv-question-error" : ""}`}>
    <legend><span className="sv-number">{String(index + 1).padStart(2, "0")}</span><span>{question.texto}</span><small>{question.obligatoria ? "Obligatoria" : "Opcional"}</small></legend>
    <p className="sv-help" id={helpId}>{surveyQuestionHelp[question.tipo]}. <Limits question={question} /></p>
    {question.tipo === "texto" && <textarea id={fieldId} aria-label={question.texto} aria-describedby={description} aria-invalid={Boolean(error)} rows={3} maxLength={question.maxLongitud} value={value || ""} onChange={event => onChange(event.target.value)} />}
    {question.tipo === "numero" && <input id={fieldId} type="number" inputMode="decimal" step="any" min={question.min} max={question.max} aria-label={question.texto} aria-describedby={description} aria-invalid={Boolean(error)} value={value ?? ""} onChange={event => onChange(event.target.value)} />}
    {question.tipo === "opcion_unica" && <div className="sv-options">{question.opciones.map((option, optionIndex) => <label key={option.id} htmlFor={`${fieldId}-${optionIndex}`}><input id={`${fieldId}-${optionIndex}`} type="radio" name={fieldId} value={option.id} checked={value === option.id} aria-describedby={description} onChange={() => onChange(option.id)} /><span>{option.texto}</span></label>)}
      {!question.obligatoria && value && <button className="sv-clear" type="button" onClick={() => onChange("")}>Quitar selección</button>}</div>}
    {question.tipo === "opcion_multiple" && <div className="sv-options">{question.opciones.map((option, optionIndex) => <label key={option.id} htmlFor={`${fieldId}-${optionIndex}`}><input id={`${fieldId}-${optionIndex}`} type="checkbox" checked={Array.isArray(value) && value.includes(option.id)} aria-describedby={description} onChange={event => {
      const previous = Array.isArray(value) ? value : []; onChange(event.target.checked ? [...previous, option.id] : previous.filter(item => item !== option.id));
    }} /><span>{option.texto}</span></label>)}</div>}
    {error && <p className="sv-field-error" id={errorId}>{error}</p>}
  </fieldset>;
}

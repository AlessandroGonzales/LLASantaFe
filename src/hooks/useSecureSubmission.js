import { useEffect, useRef } from "react";
import { validateFields } from "../../shared/forms";
import { verifyHuman } from "../lib/turnstile";

export default function useSecureSubmission(kind) {
  const challengeRef = useRef(null);
  const honeypotRef = useRef(null);
  const lastSubmission = useRef(null);
  const abortRef = useRef(null);
  useEffect(() => () => abortRef.current?.abort(), []);

  async function submit(data) {
    validateFields(kind, data);
    if (honeypotRef.current?.value) throw new Error("No se pudo verificar la solicitud.");
    const snapshot = JSON.stringify(data);
    if (lastSubmission.current?.snapshot !== snapshot) {
      lastSubmission.current = { snapshot, id: crypto.randomUUID() };
    }
    const controller = new AbortController();
    abortRef.current = controller;
    const token = await verifyHuman(challengeRef.current, kind, controller.signal);
    const timer = setTimeout(() => controller.abort(), 55000);
    try {
      const response = await fetch("/api/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          kind, requestId: lastSubmission.current.id, token,
          website: honeypotRef.current?.value || "", data,
        }),
      });
      let result;
      try { result = await response.json(); }
      catch (cause) { throw new Error("No se pudo confirmar el envío. Esperá un momento y volvé a intentar.", { cause }); }
      if (!response.ok || result.ok !== true || !result.id) {
        throw new Error(result.message || "No se pudo guardar la solicitud. Intentá nuevamente.");
      }
      return result;
    } catch (error) {
      if (error.name === "AbortError" || error instanceof TypeError) {
        throw new Error("No se pudo confirmar el envío. Revisá tu conexión y volvé a intentar. Conservamos tus datos en el formulario.", { cause: error });
      }
      throw error;
    } finally {
      clearTimeout(timer);
      abortRef.current = null;
    }
  }

  return { submit, challengeRef, honeypotRef };
}

// Sin espacio visible, salvo si Turnstile necesita una interacción de seguridad.
export default function FormProtection({ challengeRef, honeypotRef }) {
  return (
    <div style={{ margin: 0 }}>
      <div ref={challengeRef} />
      <div aria-hidden="true" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clipPath: "inset(50%)" }}>
        <label>
          Dejá este campo vacío
          <input ref={honeypotRef} type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
    </div>
  );
}

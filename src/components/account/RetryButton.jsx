import { useEffect, useState } from "react";

// Retry-After usa un único temporizador. Nunca hace otra petición automáticamente.
export default function RetryButton({ error, busy = false, onClick, className, children = "Volver a intentar" }) {
  const [released, setReleased] = useState(null);
  const seconds = error?.retryAfterSeconds || 0;
  useEffect(() => {
    if (!seconds) return;
    const timer = setTimeout(() => setReleased(error), seconds * 1000);
    return () => clearTimeout(timer);
  }, [error, seconds]);
  return <button type="button" className={className} disabled={busy || (seconds > 0 && released !== error)} onClick={onClick}>{children}</button>;
}

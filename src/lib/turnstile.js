let loading;

function loadTurnstile() {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  if (!loading) {
    loading = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      const timer = setTimeout(() => {
        script.remove();
        reject(new Error("No se pudo cargar la verificación de seguridad. Revisá tu conexión e intentá nuevamente."));
      }, 15000);
      script.onload = () => {
        clearTimeout(timer);
        if (window.turnstile) resolve(window.turnstile);
        else { script.remove(); reject(new Error("No se pudo iniciar la verificación de seguridad.")); }
      };
      script.onerror = () => {
        clearTimeout(timer);
        script.remove();
        reject(new Error("No se pudo cargar la verificación de seguridad. Revisá tu conexión o el bloqueador de contenido."));
      };
      document.head.appendChild(script);
    });
    loading.catch(() => { loading = undefined; });
  }
  return loading;
}

export async function verifyHuman(container, action, signal) {
  const sitekey = import.meta.env.VITE_TURNSTILE_SITE_KEY;
  if (!sitekey) throw new Error("El formulario todavía no está habilitado. Intentá nuevamente más tarde.");
  const turnstile = await loadTurnstile();
  if (signal.aborted || !container?.isConnected) throw new Error("El envío se canceló.");
  let widget;
  let timer;
  let abort;
  try {
    return await new Promise((resolve, reject) => {
      abort = () => reject(new Error("El envío se canceló."));
      signal.addEventListener("abort", abort, { once: true });
      timer = setTimeout(() => reject(new Error("La verificación tardó demasiado. Intentá nuevamente.")), 120000);
      widget = turnstile.render(container, {
        sitekey, action, execution: "execute", appearance: "interaction-only",
        size: "compact", language: "es", "response-field": false,
        callback: resolve,
        "error-callback": () => {
          reject(new Error("No se pudo completar la verificación de seguridad. Volvé a intentar."));
          return true;
        },
        "expired-callback": () => reject(new Error("La verificación venció. Volvé a intentar.")),
        "timeout-callback": () => reject(new Error("La verificación venció. Volvé a intentar.")),
        "before-interactive-callback": () => container.scrollIntoView({ block: "center" }),
      });
      turnstile.execute(widget);
    });
  } finally {
    clearTimeout(timer);
    signal.removeEventListener("abort", abort);
    if (widget !== undefined) turnstile.remove(widget);
  }
}

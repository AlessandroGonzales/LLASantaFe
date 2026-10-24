import { useEffect, useRef, useState } from "react";

export function useAccountAction() {
  const active = useRef(null), cooldown = useRef(null);
  const [state, setState] = useState({ pending: false, error: null, success: "", coolingDown: false });
  useEffect(() => () => { active.current?.abort(); clearTimeout(cooldown.current); }, []);
  async function run(action, success = "") {
    if (active.current || state.coolingDown) return;
    const controller = new AbortController(); active.current = controller;
    setState({ pending: true, error: null, success: "", coolingDown: false });
    try {
      await action(controller.signal);
      if (!controller.signal.aborted) setState({ pending: false, error: null, success, coolingDown: false });
    } catch (error) {
      if (!controller.signal.aborted) {
        const seconds = error.retryAfterSeconds || 0;
        setState({ pending: false, error, success: "", coolingDown: seconds > 0 });
        if (seconds > 0) cooldown.current = setTimeout(() => setState(current => ({ ...current, coolingDown: false })), seconds * 1000);
      }
    } finally { if (active.current === controller) active.current = null; }
  }
  return { ...state, busy: state.pending || state.coolingDown, run };
}

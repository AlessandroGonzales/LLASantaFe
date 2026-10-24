import { useEffect } from "react";
import { account } from "../lib/backend.js";
import { useAccount } from "../hooks/useAccount.js";

export default function AccountSession() {
  const { authenticated, sessionId } = useAccount();
  useEffect(() => {
    if (authenticated) account.loadProfile().catch(() => {});
  }, [authenticated, sessionId]);
  return null;
}

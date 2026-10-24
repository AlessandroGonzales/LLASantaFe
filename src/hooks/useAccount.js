import { useSyncExternalStore } from "react";
import { account } from "../lib/backend.js";

export function useAccount() {
  return useSyncExternalStore(account.subscribe, account.getSnapshot);
}

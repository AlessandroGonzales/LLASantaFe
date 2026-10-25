import { useSyncExternalStore } from "react";
import { affiliation } from "../lib/backend.js";
export function useAffiliation() {
  return useSyncExternalStore(affiliation.subscribe, affiliation.getSnapshot);
}

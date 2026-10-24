import { createAccountService } from "./accountService.js";

export const account = createAccountService({
  baseUrl: import.meta.env.VITE_API_BASE_URL,
  allowLocalHttp: import.meta.env.DEV,
});

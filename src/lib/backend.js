import { createAccountService } from "./accountService.js";
import { createAffiliationService } from "./affiliationService.js";
import { createSurveyService } from "./surveyService.js";

export const account = createAccountService({
  baseUrl: import.meta.env.VITE_API_BASE_URL,
  allowLocalHttp: import.meta.env.DEV,
});
export const affiliation = createAffiliationService(account);
export const surveys = createSurveyService(account);

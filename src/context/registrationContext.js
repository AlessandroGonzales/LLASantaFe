import { createContext, useContext } from "react";
export const RegistrationContext = createContext(null);
export const useRegistrationWelcome = () => useContext(RegistrationContext);

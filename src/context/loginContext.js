import { createContext, useContext } from "react";
export const LoginContext = createContext(null);
export function useLogin() { return useContext(LoginContext); }

"use client";
import { createContext, useContext } from "react";

const AppContext = createContext();
export const useAppContext = () => useContext(AppContext);

export function AppProvider({ value, children }) {
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

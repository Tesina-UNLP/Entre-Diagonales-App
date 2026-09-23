import { LanguageContext } from "@/contexts/language";
import { useContext } from "react";

export function useLanguage() {
  return useContext(LanguageContext);
}

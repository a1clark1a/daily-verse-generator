"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { type Translation } from "@/lib/translations";

export type { Translation };

type TranslationContextType = {
  translation: Translation;
  setTranslation: (translation: Translation) => void;
};

const TranslationContext = createContext<TranslationContextType | undefined>(
  undefined
);

export function TranslationProvider({ children }: { children: ReactNode }) {
  const [translation, setTranslation] = useState<Translation>("kjv");

  return (
    <TranslationContext.Provider value={{ translation, setTranslation }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error("useTranslation must be used within a TranslationProvider");
  }
  return context;
}

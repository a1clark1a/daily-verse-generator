"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type TranslationContextType = {
  translation: string;
  setTranslation: (translation: string) => void;
};

const TranslationContext = createContext<TranslationContextType | undefined>(
  undefined
);

export function TranslationProvider({ children }: { children: ReactNode }) {
  const [translation, setTranslation] = useState("kjv");

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

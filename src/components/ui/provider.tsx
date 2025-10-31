"use client";

import {
  initializeAppCheck,
  ReCaptchaEnterpriseProvider,
} from "@firebase/app-check";
import { useEffect } from "react";
import { ChakraProvider } from "@chakra-ui/react";

import { ColorModeProvider, type ColorModeProviderProps } from "./color-mode";
import { system } from "@/app/theme";
import { app } from "@/lib/firebase";

export function Provider(props: ColorModeProviderProps) {
  useEffect(() => {
    // Run only on the client
    if (typeof window !== "undefined") {
      const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

      if (siteKey) {
        initializeAppCheck(app, {
          // Use the correct provider
          provider: new ReCaptchaEnterpriseProvider(siteKey),
          isTokenAutoRefreshEnabled: true, // Automatically refresh tokens
        });
        console.log("Firebase App Check Initialized.");
      } else {
        console.warn(
          "App Check Site Key not found. App Check will not be enabled."
        );
      }
    }
  }, []); // Run once on mount

  return (
    <ChakraProvider value={system}>
      <ColorModeProvider {...props} />
    </ChakraProvider>
  );
}

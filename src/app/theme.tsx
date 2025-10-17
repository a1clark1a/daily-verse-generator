import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

import animationStyles from "@/components/animations/animationStyles";

const config = defineConfig({
  globalCss: {
    "html, body": {
      margin: 0,
      padding: 0,
    },
  },
  theme: {
    keyframes: {
      gradient: {
        "0%": { backgroundPosition: "0% 50%", backgroundColor: "#000046" },
        "50%": { backgroundPosition: "100% 50%", backgroundColor: "#1cb5e0" },
        "100%": { backgroundPosition: "0% 50%", backgroundColor: "#000046" },
      },
    },
    animationStyles,
    tokens: {
      colors: {},
      fonts: {
        heading: { value: "var(--font-permanent-marker)" },
        body: { value: "var(--font-permanent-marker)" },
      },
    },
  },
});

export const system = createSystem(defaultConfig, config);

import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const config = defineConfig({
  globalCss: {
    "html, body": {
      margin: 0,
      padding: 0,
      backgroundImage: {
        _light:
          "linear-gradient(135deg, {colors.tranquilCream.50} 0%, {colors.tranquilSky.100} 100%)",
        _dark:
          "linear-gradient(135deg, {colors.tranquilNavy.700} 0%, {colors.tranquilTeal.800} 100%)",
      },
      backgroundSize: "200% 200%",
      animation: "gradient 15s ease infinite",
      minHeight: "100vh",
    },
  },
  theme: {
    keyframes: {
      gradient: {
        "0%": { backgroundPosition: "0% 50%" },
        "50%": { backgroundPosition: "100% 50%" },
        "100%": { backgroundPosition: "0% 50%" },
      },
    },
    tokens: {
      colors: {
        // Tranquil theme - inspired by mountain lake at sunset
        // Teal palette (mountains and water)
        tranquilTeal: {
          50: { value: "#E6F7F7" },
          100: { value: "#B3E8E8" },
          200: { value: "#80D9D9" },
          300: { value: "#4FD1C5" },
          400: { value: "#319795" },
          500: { value: "#2C7A7B" },
          600: { value: "#1B6B6D" },
          700: { value: "#0F5859" },
          800: { value: "#0A4D4E" },
          900: { value: "#073B3C" },
        },
        // Golden amber palette (mountain highlights)
        tranquilGold: {
          50: { value: "#FFF5EB" },
          100: { value: "#FEEBC8" },
          200: { value: "#FBD38D" },
          300: { value: "#F6AD55" },
          400: { value: "#ED8936" },
          500: { value: "#DD6B20" },
          600: { value: "#C05621" },
          700: { value: "#9C4221" },
          800: { value: "#7C2D12" },
          900: { value: "#5A1F0F" },
        },
        // Soft cream palette (sky and horizon)
        tranquilCream: {
          50: { value: "#FFF5EB" },
          100: { value: "#FED7AA" },
          200: { value: "#F5DDB8" },
          300: { value: "#F0CEAD" },
          400: { value: "#E6C9A8" },
          500: { value: "#D4B89C" },
          600: { value: "#BEA48E" },
          700: { value: "#A08A78" },
          800: { value: "#7C6D5D" },
          900: { value: "#5A4F43" },
        },
        // Calm sky blue palette
        tranquilSky: {
          50: { value: "#F0F9FF" },
          100: { value: "#E0F2FE" },
          200: { value: "#BAE6FD" },
          300: { value: "#7DD3FC" },
          400: { value: "#38BDF8" },
          500: { value: "#0EA5E9" },
          600: { value: "#0284C7" },
          700: { value: "#0369A1" },
          800: { value: "#075985" },
          900: { value: "#0C4A6E" },
        },
        // Deep navy palette (shadows and depth)
        tranquilNavy: {
          50: { value: "#EBF0F5" },
          100: { value: "#D4DEE8" },
          200: { value: "#A8BDCE" },
          300: { value: "#7C9BB5" },
          400: { value: "#507A9C" },
          500: { value: "#2C5282" },
          600: { value: "#1A365D" },
          700: { value: "#142B4A" },
          800: { value: "#0E1F37" },
          900: { value: "#081424" },
        },
      },
      fonts: {
        heading: { value: "var(--font-permanent-marker)" },
        body: { value: "var(--font-permanent-marker)" },
      },
    },
  },
});

export const system = createSystem(defaultConfig, config);

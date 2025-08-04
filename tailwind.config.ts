import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";
import defaultTheme from "tailwindcss/defaultTheme";
import typography from "@tailwindcss/typography";
import animate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
    "app/**/*.{ts,tsx}",
    "components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Backgrounds
        "sky-top": "#D7E7FF", // Very top of gradient
        "sky-bottom": "#F1DFFF", // Very bottom of gradient
        "surface-card": "#FFF9FF", // Prompt card fill

        // Borders & Lines
        "outline-peri": "#9AA9FF", // Card & textarea border

        // Typography
        "text-primary": "#0D1B52", // "Describe your game" + nav links
        "text-button": "#0D1B52", // "Mint Game" label
        "text-muted": "#5F6FA7", // Placeholder in textarea

        // Accents (match pixel art)
        lavender: "#E5D4FF", // Play-button square (logo)
        mint: "#A0EBDC", // Joystick stem / play triangle
        pink: "#A2F5E1", // Joystick knob / gold-coin outline hit
        coin: "#FBF9FF", // Main face of floating coins
        "coin-dark": "#F6B63E", // Coin shading & "Mint Game" shadow
        cta: "#FBF9FF", // Button & textarea fill

        // Clouds
        "cloud-light": "#EDF6FF",
        "cloud-mid": "#D4E7FF",
        "cloud-outline": "#8FA0DB",

        // Keep existing chart colors
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        heading: ["'DotGothic16'", "sans-serif"],
        pixel: ["'Pixelify Sans'", "cursive"],
        display: ["var(--font-jakarta)", "sans-serif"],
      },
      animation: {
        float: "float 10s ease-in-out infinite",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        spark: "spark 0.5s ease-out forwards",
        forge: "forge 3s ease-in-out infinite",
        glow: "glow 1.5s ease-in-out infinite alternate",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0) translateX(0)" },
          "50%": { transform: "translateY(-20px) translateX(10px)" },
        },
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        spark: {
          "0%": { transform: "scale(0) rotate(0deg)", opacity: "1" },
          "100%": { transform: "scale(1) rotate(45deg)", opacity: "0" },
        },
        forge: {
          "0%": { filter: "brightness(1) contrast(1)" },
          "50%": { filter: "brightness(1.3) contrast(1.2)" },
          "100%": { filter: "brightness(1) contrast(1)" },
        },
        glow: {
          "0%": {
            boxShadow:
              "0 0 5px rgba(255, 123, 0, 0.5), 0 0 10px rgba(255, 77, 0, 0.3)",
          },
          "100%": {
            boxShadow:
              "0 0 10px rgba(255, 123, 0, 0.8), 0 0 20px rgba(255, 77, 0, 0.5)",
          },
        },
      },
    },
  },
  plugins: [typography, animate, require("tailwindcss-animate")],
};

export default config;

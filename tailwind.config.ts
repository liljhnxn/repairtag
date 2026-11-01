import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        charcoal: {
          950: "#090a0f",
          900: "#0f1118",
          850: "#141722",
          800: "#1a1e2d",
          700: "#24293d",
          600: "#323952",
        },
        brandPurple: {
          light: "#c084fc",
          DEFAULT: "#9333ea",
          muted: "#7e22ce",
          dark: "#581c87",
        },
        brandGreen: {
          light: "#4ade80",
          DEFAULT: "#10b981",
          muted: "#059669",
          dark: "#064e3b",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;


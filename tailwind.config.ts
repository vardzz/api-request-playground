import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0F1115",
        surface: "#161A20",
        elevated: "#1C2128",
        accent: "#6366F1",
        "primary-text": "#F4F1EA",
        "secondary-text": "#B5B8BE",
        "muted-text": "#7B8089",
        border: "rgba(255,255,255,.06)",
        success: "#22C55E",
        warning: "#F59E0B",
        danger: "#EF4444",
      },
      borderRadius: {
        card: "16px",
        input: "12px",
        button: "12px",
        pill: "999px",
      },
      boxShadow: {
        subtle: "0 8px 30px rgba(0,0,0,.18)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        heading: ["var(--font-satoshi)", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      }
    },
  },
  plugins: [],
};
export default config;

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        crown: {
          gold: "#b3874b",
          "gold-light": "#c9a06a",
          "gold-dark": "#96703d",
          charcoal: "#1a1a1a",
          "charcoal-light": "#2d2d2d",
          slate: "#f5f3f0",
          "slate-dark": "#e8e4df",
        },
      },
    },
  },
  plugins: [],
};
export default config;

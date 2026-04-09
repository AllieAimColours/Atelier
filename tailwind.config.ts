import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#090806",
        ivory: "#f4ede1",
        "ivory-dim": "rgba(244,237,225,0.62)",
        gold: "#c4a06a",
        "gold-dim": "rgba(196,160,106,0.72)",
        "gold-line": "rgba(196,160,106,0.28)",
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', "serif"],
        sans: ['"Jost"', "sans-serif"],
      },
      letterSpacing: {
        wider: "0.18em",
        widest: "0.32em",
      },
    },
  },
  plugins: [],
};

export default config;

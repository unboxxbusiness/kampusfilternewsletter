import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Brand palette
        brand: {
          black:  "#000000",
          navy:   "#14213d",
          amber:  "#fca311",
          "amber-hover": "#e6930f",
          gray:   "#e5e5e5",
          white:  "#ffffff",
        },
        editorial: {
          offwhite:   "#ffffff",
          charcoal:   "#14213d",
          darkblack:  "#000000",
          lightgrey:  "#e5e5e5",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "Inter", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;

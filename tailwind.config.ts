import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#08070b",
        plum: "#211822",
        lavender: "#c8bfd4",
        blush: "#cba7b5",
        bone: "#e8e1d9",
        silver: "#a9a8b2",
        moon: "#a8bdd0"
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Arial", "sans-serif"]
      }
    }
  },
  plugins: []
} satisfies Config;

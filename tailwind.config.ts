import { type Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        "hope-orange": "#F58726",
        "hope-darkcyan": "#0E7E6F",
        "hope-blackcyan": "#094841",
        "hope-lightgray": "#D9D9D9",
        "hope-darkgray": "#5F5F5F",
        "hope-beige": "#FFF0C8",
        "hope-green": "#2A8D7D",
        "hope-lightcyan": "#40B5A3",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        // ... rest of the shadcn colors
      },
      // ... rest of the shadcn theme extensions
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

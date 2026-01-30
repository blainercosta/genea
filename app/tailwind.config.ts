import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Genea Brand Colors
        genea: {
          green: "#4A5D4A",
          "green-hover": "#3D4D3D",
          amber: "#D4A574",
        },
        // Interface Harmony Design System
        ih: {
          bg: "#FAF8F4",
          surface: "#FFFFFF",
          "surface-warm": "#F5F2EC",
          text: "#2C2C2C",
          "text-secondary": "#6B6B6B",
          "text-muted": "#9A9A9A",
          border: "#E5E2DC",
          "border-strong": "#D0CCC4",
          accent: "#C67A52",
          "accent-soft": "rgba(198, 122, 82, 0.125)",
          positive: "#5A9E6F",
          negative: "#C4574C",
        },
      },
      fontFamily: {
        sans: ["IBM Plex Sans", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "4xl": "1.75rem",
      },
      boxShadow: {
        card: "0 8px 32px rgba(0, 0, 0, 0.05)",
        "card-sm": "0 4px 24px rgba(0, 0, 0, 0.05)",
        toast: "0 4px 12px rgba(0, 0, 0, 0.1)",
      },
    },
  },
  plugins: [],
};

export default config;

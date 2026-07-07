import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ember: {
          50: "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#f97316",
          600: "#ea580c",
          700: "#c2410c",
          800: "#9a3412",
          900: "#7c2d12"
        },
        fire: {
          100: "#fff2db",
          200: "#ffd89c",
          300: "#ffb765",
          400: "#fb8f3c",
          500: "#eb5e28"
        }
      },
      fontFamily: {
        sans: [
          "\"Aptos\"",
          "\"Segoe UI\"",
          "\"PingFang SC\"",
          "\"Microsoft YaHei\"",
          "sans-serif"
        ],
        display: [
          "\"Palatino Linotype\"",
          "\"Noto Serif CJK SC\"",
          "\"Source Han Serif SC\"",
          "Georgia",
          "serif"
        ]
      },
      boxShadow: {
        glow: "0 18px 48px rgba(88, 42, 18, 0.18)",
        card: "0 18px 42px rgba(30, 27, 24, 0.08)"
      },
      backgroundImage: {
        "warm-radial":
          "linear-gradient(180deg, #f7f2ea 0%, #fffaf3 42%, #f6f7f4 100%)"
      }
    }
  },
  plugins: []
};

export default config;

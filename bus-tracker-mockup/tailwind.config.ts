import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          50: "#f5f7fa",
          100: "#e8ecf2",
          200: "#cbd3df",
          300: "#9ca7b8",
          400: "#67738a",
          500: "#3c4a63",
          600: "#22304a",
          700: "#142039",
          800: "#0b1a30",
          900: "#08152a",
        },
        navy: {
          DEFAULT: "#0B2545",
          50: "#eaf0f8",
          100: "#cfdbed",
          200: "#9fb6db",
          500: "#1d4079",
          600: "#13315b",
          700: "#0B2545",
          800: "#081a33",
          900: "#050f22",
        },
        amber: {
          DEFAULT: "#F59E0B",
          50: "#fff8eb",
          100: "#feecc7",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
        },
        success: { 500: "#10b981", 100: "#d1fae5" },
        danger: { 500: "#ef4444", 100: "#fee2e2" },
        warn: { 500: "#f59e0b", 100: "#fef3c7" },
      },
      fontFamily: {
        sans: ["var(--font-jakarta)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      boxShadow: {
        card: "0 1px 2px rgba(11, 37, 69, 0.04), 0 8px 24px -8px rgba(11, 37, 69, 0.08)",
        lift: "0 4px 8px -2px rgba(11, 37, 69, 0.06), 0 24px 40px -16px rgba(11, 37, 69, 0.16)",
        glass: "0 8px 32px rgba(11, 37, 69, 0.18)",
      },
      backgroundImage: {
        grid: "radial-gradient(circle at 1px 1px, rgba(11,37,69,0.06) 1px, transparent 0)",
      },
    },
  },
  plugins: [],
};

export default config;

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#111113",
          900: "#18181B",
          700: "#3F3F46",
          500: "#71717A",
          400: "#A1A1AA",
          200: "#E4E4E7",
          100: "#F4F4F5",
          50: "#FAFAF8",
        },
        accent: {
          DEFAULT: "#4F46E5",
          hover: "#4338CA",
          soft: "#EEF2FF",
        },
        papers: {
          DEFAULT: "#0F766E",
          soft: "#CCFBF1",
        },
        topics: {
          DEFAULT: "#C2410C",
          soft: "#FFEDD5",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 1px 2px rgba(24, 24, 27, 0.06), 0 8px 24px rgba(24, 24, 27, 0.04)",
      },
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      colors: {
        ch1: "#ef6461",
        ch2: "#e4b363",
        ch3: "#44af69",
        ch4: "#3b82f6",
        ch5: "#8b5cf6",
        ch6: "#f97316",
        q1: "#06b6d4",
        q2: "#ec4899",
        q3: "#14b8a6",
        q4: "#f59e0b",
        q5: "#6366f1",
        q6: "#10b981",
      },
    },
  },
  plugins: [],
};

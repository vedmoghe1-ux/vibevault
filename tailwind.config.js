/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0A0910",
        ink2: "#110E1A",
        line: "rgba(255,255,255,.09)",
        glass: "rgba(255,255,255,.045)",
        paper: "#F3EFFF",
        muted: "#948CB4",
        // live accents — rebound per aesthetic at runtime
        a1: "var(--a1)",
        a2: "var(--a2)",
      },
      fontFamily: {
        display: ["Syne", "system-ui", "sans-serif"],
        sans: ["Space Grotesk", "system-ui", "sans-serif"],
      },
      borderRadius: { vault: "22px" },
    },
  },
  plugins: [],
};

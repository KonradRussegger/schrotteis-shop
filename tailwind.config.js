/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#FFFFFF",
        bgAlt: "#F7F5F1",
        card: "#F7F5F1",
        tan: "#B8845C",
        tanLight: "#96693F",
        saddle: "#B8845C",
        brass: "#A8875A",
        cream: "#211812",
        muted: "#9C9184",
        line: "#E8E3DA",
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["'Work Sans'", "sans-serif"],
        mono: ["'IBM Plex Mono'", "monospace"],
      },
    },
  },
  plugins: [],
};

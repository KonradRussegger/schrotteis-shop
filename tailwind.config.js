/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#1C1410",
        bgAlt: "#241A14",
        card: "#2A1E17",
        tan: "#B8845C",
        tanLight: "#D9B08C",
        saddle: "#5C3524",
        brass: "#A8875A",
        cream: "#EFE6D8",
        muted: "#B8A995",
        line: "#3A2C22",
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

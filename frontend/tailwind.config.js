/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        lightBackground: "#ffffff",
        lightText: "#ffffff",
        darkBackground: "#111827",
        darkText: "#000000",
        secondary: "#a6a6a6",
        primary: "#A855F7",
        darkGray: "#828282",
        skyBlue:'#0867d2'
      },
      screens: {
        "5xl": "1800px",
      },
    },
  },
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  plugins: [],
};

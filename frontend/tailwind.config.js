/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        lightBackground: "#ffffff",
        lightText: "#ffffff",
        darkBackground: "#2a2a2a",
        darkText: "#000000",
        secondary: "#a6a6a6",
        primary: "#A855F7",
        darkGray: "#828282",
      },
    },
  },
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  plugins: [],
};

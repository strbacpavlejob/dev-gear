/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        emblema: "Emblema One",
        pirulen: "Pirulen",
        rubik: "Rubik 80s Fade",
      },
      colors: {
        "light-blue": "#6ec6ff",
        "dark-blue": "#0069c0",
        red: "#A80400",
        blue: "#2196f3",
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/aspect-ratio"),
    require("@tailwindcss/forms"),
  ],
};

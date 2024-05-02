/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'hope-orange': '#F58726',
        'hope-lightcyan': '#31A595',
        'hope-darkcyan': '#0E7E6F',
        'hope-lightgray': '#D9D9D9',
        'hope-darkgray': '#5F5F5F',
        'hope-beige': '#FFF0C8'
      }
    },
  },
  plugins: [],
}
/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: '',
  content: [
    "./src/**/*.{html,js}",
    "./src/**/**/*.{html,js}",
    "./src/**/**/**/*.{html,js}"
  ],
  theme: {
    extend: {},
    fontFamily: {
      'oswald': ['"Oswald"', 'sans-serif'],
      'slab': ['"Roboto Slab"', 'serif'],
      'imperial':['Imperial Script']
    },
  },
  plugins: [],
}
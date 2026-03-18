/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        brand: {
          green: '#24c45c', // Similar ao verde do Organizze
          darkGreen: '#1a9344',
          gray: '#f5f7f9',
          darkGray: '#333333',
        }
      }
    },
  },
  plugins: [],
}

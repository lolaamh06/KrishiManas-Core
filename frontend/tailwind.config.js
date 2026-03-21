/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        teal: {
          light: '#E8F8F5',
          primary: '#0D7377',
          accent: '#14A085'
        },
        navy: '#1A1A2E',
        system: {
          red: '#E74C3C',
          yellow: '#F39C12',
          green: '#27AE60',
          bg: '#f8f9fa'
        }
      }
    },
  },
  plugins: [],
}

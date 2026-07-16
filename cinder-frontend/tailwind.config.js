/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'charcoal': {
          DEFAULT: '#0d0806',
          light: '#1a0e08',
        },
        'flame': {
          red: '#8B1A0A',
          orange: '#FF6B1A',
          gold: '#FFB627',
        }
      },
      backgroundImage: {
        'flame-gradient': 'linear-gradient(to right, #8B1A0A, #FF6B1A, #FFB627)',
      }
    },
  },
  plugins: [],
}

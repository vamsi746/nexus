/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg0: '#0A0A0C',
        bg1: '#111114',
        bg2: '#1A1A1D',
        bg3: '#222226',
        surface: '#16161A',
        accent: '#6366F1',
        'accent-light': '#818CF8',
        tx0: '#EBECE7',
        tx1: '#D0D0D5',
        tx2: '#9A9A9D',
        tx3: '#6A6A6D',
      },
      fontFamily: {
        sans: ['Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      colors: {
        forest: {
          950: '#08160D',
          900: '#0D2216',
          850: '#122C1C',
          800: '#173823',
          700: '#204A2E',
          600: '#2C6039',
          500: '#3A7A48',
        },
        moss: {
          600: '#2F9E52',
          500: '#3DB863',
          400: '#5CCB7C',
          300: '#8ADFA2',
          200: '#BEEECC',
          100: '#E1F6E6',
          50: '#F1FAF2',
        },
        sand: {
          50: '#F6F8F3',
          100: '#F0F4EC',
          200: '#E6EBDF',
        },
        ember: {
          500: '#E15B4D',
          100: '#FBE4E1',
        },
      },
      boxShadow: {
        panel: '0 1px 2px rgba(13,34,22,0.04), 0 8px 24px -8px rgba(13,34,22,0.10)',
        soft: '0 1px 3px rgba(13,34,22,0.06)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
}

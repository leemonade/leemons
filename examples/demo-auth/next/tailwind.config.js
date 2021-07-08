module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        'leemons-petrol': {
          DEFAULT: '#212B3D',
          10: '#F7F9FC',
          20: '#E8EDF4',
          50: '#B3BFD6',
          100: '#9DADCA',
          200: '#7289B3',
          300: '#485264',
          400: '#333F56',
          500: '#212B3D',
          600: '#1A202B',
          700: '#0F141C',
          800: '#06080B',
          900: '#000000',
        },
      },
      fontFamily: {
        lexend: ['Lexend', 'sans-serif'],
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};

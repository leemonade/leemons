const defaultTheme = require('tailwindcss/defaultTheme');
const typography = require('@tailwindcss/typography');
// const leemonsUI = require('./dist/theme');
const colors = require('./src/theme/colors');

module.exports = {
  dark: false,
  purge: {
    content: [
      './pages/**/*.{js,ts,jsx,tsx}',
      './lib/**/*.{js,ts,jsx,tsx}',
      './partials/**/*.{js,ts,jsx,tsx}',
    ],
  },
  theme: {
    fontFamily: {
      sans: ['Lexend', ...defaultTheme.fontFamily.sans],
      inter: ['Inter', ...defaultTheme.fontFamily.sans],
    },
    extend: {
      colors,
    },
  },
  variants: {
    extend: {},
  },
  plugins: [typography],
};

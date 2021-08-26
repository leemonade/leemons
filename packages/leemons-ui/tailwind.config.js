const defaultTheme = require('tailwindcss/defaultTheme');
const typography = require('@tailwindcss/typography');
// const leemonsUI = require('./dist/theme');
const colors = require('./src/theme/colors');
const width = require('./src/theme/extends/width');

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
    boxShadow: {
      ...defaultTheme.boxShadow,
      xl: '0px 2px 0px 0px rgba(51, 63, 86, 0.05), 0px 10px 36px 0px rgba(35, 43, 60, 0.05)',
    },
    extend: {
      colors,
      width,
    },
  },
  variants: {
    extend: {},
  },
  plugins: [typography],
};

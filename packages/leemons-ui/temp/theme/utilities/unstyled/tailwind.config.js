const plugin = require('tailwindcss/plugin');
const colors = require('../../../../dist/theme/colors');
const base = require('../../../../dist/theme/base');
const utilities = require('../../../../dist/theme/utilities');

module.exports = {
  theme: {
    colors,
  },
  plugins: [
    plugin(({ addBase, addUtilities }) => {
      addBase(base);
      addUtilities(utilities, { variants: ['responsive'] });
    }),
  ],
};

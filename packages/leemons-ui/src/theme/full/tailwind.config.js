const plugin = require('tailwindcss/plugin');
const colors = require('../../../dist/theme/colors');
const base = require('../../../dist/theme/base');
const utilities = require('../../../dist/theme/utilities');
const utilitiesStyled = require('../../../dist/theme/utilities-styled');
const utilitiesUnstyled = require('../../../dist/theme/utilities-unstyled');
const styled = require('../../../dist/theme/styled');

module.exports = {
  theme: {
    colors,
  },
  corePlugins: [
    'animation',
    'backgroundColor',
    'backgroundImage',
    'borderColor',
    'divideColor',
    'gradientColorStops',
    'placeholderColor',
    'preflight',
    'ringColor',
    'ringOffsetColor',
    'ringOffsetWidth',
    'ringOpacity',
    'ringWidth',
    'textColor',
    'transitionProperty',
  ],
  plugins: [
    plugin(({ addBase, addUtilities, addComponents }) => {
      addBase(base);
      addComponents(styled);
      addUtilities(utilities, { variants: ['responsive'] });
      addUtilities(utilitiesUnstyled, { variants: ['responsive'] });
      addUtilities(utilitiesStyled, { variants: ['responsive'] });
    }),
  ],
};

const plugin = require('tailwindcss/plugin');
const colors = require('../../../dist/theme/colors');
const fontFamily = require('../../../dist/theme/fonts');
const base = require('../../../dist/theme/base');
const utilities = require('../../../dist/theme/utilities');
const utilitiesStyled = require('../../../dist/theme/utilities-styled');
const utilitiesUnstyled = require('../../../dist/theme/utilities-unstyled');
const components = require('../../../dist/theme/styled');
const width = require('../../../dist/theme/extends/width');
const boxShadow = require('../../../dist/theme/extends/boxShadow');

module.exports = {
  theme: {
    colors,
    fontFamily,
    width,
    boxShadow,
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
      addComponents(components);
      addUtilities(utilities, { variants: ['responsive'] });
      addUtilities(utilitiesUnstyled, { variants: ['responsive'] });
      addUtilities(utilitiesStyled, { variants: ['responsive'] });
    }),
  ],
};

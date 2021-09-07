const tailwindcss = require('tailwindcss');
const pcssImport = require('postcss-import');
const pcssNested = require('postcss-nested');
const cssnano = require('cssnano');

module.exports = {
  plugins: [
    pcssImport,
    tailwindcss('./src/theme/themes/tailwind.config.js'),
    pcssNested({
      bubble: ['screen'],
    }),
    cssnano({
      preset: [
        'default',
        {
          mergeRules: false,
        },
      ],
    }),
  ],
};

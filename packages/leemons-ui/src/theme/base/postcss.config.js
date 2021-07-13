const pcssImport = require('postcss-import');
const pcssNested = require('postcss-nested');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

module.exports = {
  plugins: [
    pcssImport,
    pcssNested({
      bubble: ['screen'],
    }),
    autoprefixer,
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

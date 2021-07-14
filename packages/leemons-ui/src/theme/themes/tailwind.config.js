const leemonsUI = require('../../../dist/theme/index');

module.exports = {
  corePlugins: {
    preflight: false,
  },
  daisyui: {
    base: false,
  },
  plugins: [leemonsUI],
};

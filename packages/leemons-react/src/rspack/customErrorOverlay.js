const DefaultOverlay = require('@rspack/plugin-react-refresh/overlay');

const ErrorOverlay = {
  ...DefaultOverlay,
  handleRuntimeError(error) {
    if (!error.isLeemonsApiError) {
      DefaultOverlay.handleRuntimeError(error);
    }
  },
};

module.exports = ErrorOverlay;

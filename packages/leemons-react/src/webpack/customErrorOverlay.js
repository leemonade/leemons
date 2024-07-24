const DefaultOverlay = require('@pmmmwh/react-refresh-webpack-plugin/overlay');

const ErrorOverlay = {
  hasUnrecoverableErrors() {
    return DefaultOverlay.hasUnrecoverableErrors();
  },

  getServerError() {
    return DefaultOverlay.getServerError();
  },

  showCompileError(errors) {
    return DefaultOverlay.showCompileError(errors);
  },

  clearCompileError() {
    return DefaultOverlay.clearCompileError();
  },

  handleRuntimeError(error) {
    if (!error.isLeemonsApiError) {
      DefaultOverlay.handleRuntimeError(error);
    }
  },

  clearRuntimeErrors() {
    return DefaultOverlay.clearRuntimeErrors();
  },
};

module.exports = ErrorOverlay;

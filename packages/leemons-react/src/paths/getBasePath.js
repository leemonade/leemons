const path = require('path');

module.exports = function getBasePath(basePath) {
  if (!basePath) {
    return null;
  }

  const cwd = process.cwd();
  if (path.isAbsolute(basePath)) {
    return basePath;
  }

  return path.join(cwd, basePath);
};

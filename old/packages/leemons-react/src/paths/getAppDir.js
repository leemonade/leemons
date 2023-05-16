const path = require('path');

module.exports = function getAppDir(appDir = '') {
  const cwd = process.cwd();
  if (path.isAbsolute(appDir)) {
    return appDir;
  }

  return path.join(cwd, appDir);
};

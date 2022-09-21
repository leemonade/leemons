const path = require('path');

module.exports = function getBuildDir(outputDir = './build') {
  const cwd = process.cwd();
  if (path.isAbsolute(outputDir)) {
    return outputDir;
  }

  return path.join(cwd, outputDir);
};

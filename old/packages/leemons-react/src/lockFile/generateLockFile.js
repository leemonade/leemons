const { hash } = require('../crypto');

// Generate current status description file
module.exports = async function generateLockFile(plugins) {
  const lockFile = {
    plugins,
    hash: null,
  };

  lockFile.hash = hash(lockFile);
  return lockFile;
};

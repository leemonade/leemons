const fs = require('fs-extra');

module.exports = async (dir) => {
  if (!(await fs.exists(dir))) {
    return true;
  }

  const files = await fs.readdir(dir);
  return files.length === 0;
};

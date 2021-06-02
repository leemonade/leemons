const fs = require('fs-extra');

module.exports = async (dir) => {
  // If the folder does not exists, then is empty
  if (!(await fs.exists(dir))) {
    return true;
  }

  // Check if the folder exists but is empty
  const files = await fs.readdir(dir);
  return files.length === 0;
};

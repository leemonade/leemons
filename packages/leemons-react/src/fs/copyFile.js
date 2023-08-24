const fs = require('fs-extra');

module.exports = async function copyFile(src, dest) {
  try {
    await fs.copyFile(src, dest);
  } catch (e) {
    throw new Error(`Can't copy file ${src} into ${dest}`);
  }
};

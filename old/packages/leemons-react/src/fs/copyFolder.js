const fs = require('fs-extra');

module.exports = async function copyFolder(src, dest) {
  try {
    await fs.copy(src, dest, { recursive: true });
  } catch (e) {
    throw new Error(`Can't copy folder ${src} into ${dest}`);
  }
};

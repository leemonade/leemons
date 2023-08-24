const fs = require('fs-extra');

// Create folder and parents if needed
module.exports = async function createFolder(dir) {
  try {
    await fs.mkdirp(dir);
  } catch (e) {
    throw new Error("Can't create  folder");
  }
};

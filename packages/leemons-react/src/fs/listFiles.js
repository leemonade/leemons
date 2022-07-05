const fs = require('fs-extra');
const getFileType = require('./getFileType');

// List all the files inside a directory
module.exports = async function listFiles(dir, useMap = false) {
  try {
    const data = (await fs.readdir(dir, { withFileTypes: true })).map((file) => ({
      name: file.name,
      type: getFileType(file),
    }));
    if (useMap) {
      const map = new Map();
      data.map((file) => map.set(file.name, file));
      return map;
    }
    return data;
  } catch (e) {
    throw new Error("Can't read directory");
  }
};

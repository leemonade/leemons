const fs = require('fs-extra');
const path = require('path');

module.exports = async function removeFiles(dir, files, ignored = []) {
  ignored.forEach((file) => files.delete(file));

  await Promise.all(
    [...files.values()].map((file) =>
      fs.rm(path.isAbsolute(file.name) ? file.name : path.resolve(dir, file.name), {
        recursive: true,
        force: true,
      })
    )
  );
};

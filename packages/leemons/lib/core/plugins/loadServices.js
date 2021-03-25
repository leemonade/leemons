const fs = require('fs-extra');
const path = require('path');
const { loadFile } = require('../config/loadFiles');

function loadServices(dir) {
  if (!fs.existsSync(dir)) {
    return {};
  }
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((file) => file.isFile())
    .reduce((services, file) => {
      const key = path.basename(file.name, path.extname(file.name));
      if (services[key]) {
        throw new Error(
          `${file.name} service already exists on ${dir}. (do not use same name in .js files and .json files)`
        );
      }
      let fileContent;
      const fileExt = path.extname(file.name);
      if (fileExt === '.json') {
        fileContent = loadFile(path.resolve(dir, file.name));
      } else if (fileExt === '.js') {
        try {
          // eslint-disable-next-line import/no-dynamic-require, global-require
          fileContent = require(path.resolve(dir, file.name));
        } catch (e) {
          throw new Error(`File can not be read: ${file}. ${e.message}`);
        }
      }
      if (fileContent) {
        return { ...services, [key]: fileContent };
      }
      return services;
    }, {});
}

module.exports = loadServices;

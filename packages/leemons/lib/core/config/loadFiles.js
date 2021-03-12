const fs = require('fs-extra');
const path = require('path');

const { env } = require('leemons-utils');

function loadJSFile(file) {
  try {
    // eslint-disable-next-line import/no-dynamic-require, global-require
    const fileContent = require(file);
    if (typeof fileContent === 'function') {
      return fileContent(env);
    }
    return fileContent;
  } catch (e) {
    throw new Error(`File can not be read: ${file}. ${e.message}`);
  }
}

function loadJSONFile(file) {
  return JSON.parse(fs.readFileSync(file));
}

function loadFile(file) {
  const extension = path.extname(file);

  if (extension === '.js') {
    return loadJSFile(file);
  }
  if (extension === '.json') {
    return loadJSONFile(file);
  }
  return null;
}

function loadFiles(dir) {
  if (!fs.existsSync(dir)) {
    return {};
  }
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((file) => file.isFile())
    .reduce((config, file) => {
      const key = path.basename(file.name, path.extname(file.name));
      if (config[key]) {
        throw new Error(
          `${file.name} configuration already exists on ${dir}. (do not use same name in .js files and .json files)`
        );
      }
      const fileConfig = loadFile(path.resolve(dir, file.name));
      if (fileConfig) {
        return { ...config, [key]: fileConfig };
      }
      return config;
    }, {});
}

module.exports = { loadFiles };

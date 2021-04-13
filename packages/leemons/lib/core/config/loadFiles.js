const fs = require('fs-extra');
const path = require('path');
const { env } = require('leemons-utils');
const vm = require('./vm');

function loadJSFile(file) {
  try {
    const fileContent = vm(path.dirname(file)).runFile(file);
    if (typeof fileContent === 'function') {
      return fileContent({ env, leemons });
    }
    return fileContent;
  } catch (e) {
    throw new Error(`File can not be read: ${file}. ${e.message}`);
  }
}

function loadJSONFile(file) {
  try {
    return JSON.parse(fs.readFileSync(file));
  } catch (e) {
    throw new Error(`File can not be read: ${file}. ${e.message}`);
  }
}

function loadFile(file, accept = ['.js', '.json']) {
  const extension = path.extname(file);

  if (extension === '.js' && accept.includes('.js')) {
    return loadJSFile(file);
  }
  if (extension === '.json' && accept.includes('.json')) {
    return loadJSONFile(file);
  }
  return null;
}

function loadFiles(dir, { accept = ['.js', '.json'], exclude = [] } = {}) {
  if (!fs.existsSync(dir)) {
    return {};
  }
  // Get all the files
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((file) => file.isFile())
    .reduce((config, file) => {
      // Remove excluded files
      if (exclude.includes(file.name)) {
        return config;
      }
      // Generate a key for the object based on the file name
      const key = path.basename(file.name, path.extname(file.name));
      if (config[key]) {
        throw new Error(
          `${file.name} configuration already exists on ${dir}. (do not use same name in .js files and .json files)`
        );
      }

      // Load the current file
      const fileConfig = loadFile(path.resolve(dir, file.name), accept);

      if (fileConfig) {
        return { ...config, [key]: fileConfig };
      }
      return config;
    }, {});
}

module.exports = { loadFiles, loadFile };

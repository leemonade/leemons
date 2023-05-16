const fs = require('fs-extra');
const path = require('path');
const vm = require('./vm');

/**
 * Loads a JS file securely (inside a VM).
 * If the file exports a function, it executes it with leemons and env function,
 * if it is a JSON, it just return it.
 *
 * The can be executed with a custom env and also a filter (see ./vm/index.js)
 */
async function loadJSFile(
  file,
  { filter = null, allowedPath = null, env = {}, execFunction = true, plugin, type } = {}
) {
  let allowedDir = allowedPath;
  try {
    if (allowedPath === null) {
      allowedDir = path.dirname(file);
    }
    // Load the file in a VM (for security reasons)
    const fileContent = await vm({ allowedPath: allowedDir, filter, env, plugin, type }).runFile(
      file
    );
    if (typeof fileContent === 'function' && execFunction) {
      return fileContent({ leemons });
    }
    return fileContent;
  } catch (e) {
    console.error(e);
    throw new Error(`File can not be read: ${file}. ${e.message}`);
  }
}

/**
 * Loads a JSON file with the FS, then parse the JSON and returns it
 */
async function loadJSONFile(file) {
  try {
    return JSON.parse(await fs.readFile(file));
  } catch (e) {
    throw new Error(`File can not be read: ${file}. ${e.message}`);
  }
}

/**
 * Loads the given file (.js or .json). The file can be rejected if doesn't match
 * one of the accepted extensions (done for avoiding extension comparision when
 * loading a user-input file).
 *
 * The given file can be loaded with a custom env, loaded inside process.env
 * and also a custom filter for giving global variables to the
 * file (see ./vm/index.js for more info).
 */
async function loadFile(
  file,
  {
    accept = ['.js', '.json'],
    filter = null,
    allowedPath = null,
    env = {},
    execFunction = true,
    plugin,
    type,
  } = {}
) {
  const extension = path.extname(file);

  if (await fs.exists(file)) {
    // If it is a JS file and it is allowed, then load it
    if (extension === '.js' && accept.includes('.js')) {
      return loadJSFile(file, { filter, allowedPath, env, execFunction, plugin, type });
    }
    // If it is a JSON file and it is allowed, then load it
    if (extension === '.json' && accept.includes('.json')) {
      return loadJSONFile(file);
    }
  }
  return null;
}

/**
 * Loads all files (.js or .json) in the given directory.
 * The file can be rejected if doesn't match one of the
 * accepted extensions (done for avoiding extension comparision when
 * loading a user-input file).
 *
 * An exclude option is also provided for excluding certain filenames
 *
 * The given file can be loaded with a custom env, loaded inside process.env
 * and also a custom filter for giving global variables to the
 * file (see ./vm/index.js for more info).
 */
async function loadFiles(
  dir,
  {
    accept = ['.js', '.json'],
    exclude = [],
    filter = null,
    env = {},
    allowedPath = null,
    execFunction = true,
    plugin,
    type,
  } = {}
) {
  // If the directory doesn't exists, return an empty object
  if (!(await fs.exists(dir))) {
    return {};
  }

  // Get all the files
  return (
    // Asynchronously read all the files in the directory
    (await fs.readdir(dir, { withFileTypes: true }))
      // Keep only those items which are files
      .filter((file) => file.isFile())
      .reduce(async (configPromise, file) => {
        // Wait until config is resolved;
        const config = await configPromise;

        // Remove excluded files
        if (exclude.includes(file.name)) {
          return config;
        }

        // Generate a key for the object based on the filename
        const key = path.basename(file.name, path.extname(file.name));
        if (config[key]) {
          throw new Error(
            `${file.name} configuration already exists on ${dir}. (do not use same name in .js files and .json files)`
          );
        }

        // Load the current file
        const fileConfig = await loadFile(path.resolve(dir, file.name), {
          accept,
          filter,
          allowedPath,
          env,
          execFunction,
          plugin,
          type,
        });

        // Append to the current config
        if (fileConfig) {
          return { ...config, [key]: fileConfig };
        }
        return config;
      }, {})
  );
}

module.exports = { loadFiles, loadFile };

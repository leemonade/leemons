const _ = require('lodash');

/**
 * @typedef {object} configProvider
 * @property {(path:string, defaultValue?:*) => *} get Returns path's property value, if no value is defined, return defaultValue
 * @property {(path:string) => boolean} has Returns a boolean meaning if the path's property exist
 * @property {(path:string, newValue:*) => configProvider} set Sets the new value to the path's property and returns the config object
 */

/**
 * Generates a config provider, which has the actual config with some helper functions
 *
 * get: `(path, defaultValue) => {}` returns the desired property value`
 *
 * has: `(path, defaultValue) => {}` Returns a boolean meaning if the path's property exist
 *
 * set: `(path, defaultValue) => {}` Sets the new value to the path's property and returns the config object
 * @param {object} configObj
 * @returns {configProvider} Returns the config object with some helper functions
 */
function configProvider(configObj = {}) {
  const config = _.cloneDeep(configObj);
  Object.assign(config, {
    get: (key, defaultValue) => _.get(config, key, defaultValue),
    has: (key) => _.has(config, key),
    set: (key, value) => _.set(config, key, value),
  });
  return config;
}

module.exports = { configProvider };

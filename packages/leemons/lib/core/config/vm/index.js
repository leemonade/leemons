const { NodeVM } = require('vm2');
const path = require('path');
const _ = require('lodash');
const utils = require('leemons-utils');

const protect = require('./protect');

function filterLeemons(filter) {
  let filtered = {
    leemons: _.fromPairs(
      _.entries(
        _.pick(leemons, ['log', 'query', 'events' /* 'config', 'plugins', 'plugin' */])
      ).map(([name, property]) => {
        if (_.isFunction(property)) {
          return [name, property.bind(leemons)];
        }
        return [name, property];
      })
    ),
    utils,
  };

  if (filter) {
    filtered = filter(filtered);
  }
  return filtered;
}

module.exports = ({ allowedPath, filter = null, env = {}, plugin, type }) => {
  // Set the allowed routes for imports
  const root = [
    allowedPath,
    path.resolve(leemons.dir ? leemons.dir.app : process.cwd(), 'node_modules'),
  ];

  const builtin = [
    'path',
    'url',
    'assert',
    'buffer',
    'crypto',
    'events',
    'querystring',
    'readline',
    'stream',
    'string_decoder',
    'zlib',
    'constants',
    'fs',
    'fs/promises',
    'util',
    'os',
    'events',
  ];

  // Set-up a NodeVM with the limititations
  const vm = new NodeVM({
    sandbox: filterLeemons(filter),
    env,
    require: {
      external: true,
      // Run every imported file inside the VM
      context: 'sandbox',
      // If the insecure flag is true, disable the require restriction
      root: leemons.config && leemons.config.get('config.insecure', false) ? undefined : root,
      // Allow the following node-builtin modules
      builtin,
      // Ensure a protected use of FS (only access inside the given directory)
      mock: protect(allowedPath, plugin, type)(),
    },
  });

  return vm;
};

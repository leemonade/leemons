const { NodeVM } = require('vm2');
const path = require('path');
const utils = require('leemons-utils');

const protect = require('./protect');

module.exports = (allowedPath) => {
  // Set the allowed routes for imports
  const root = [
    allowedPath,
    path.resolve(leemons.dir ? leemons.dir.app : process.cwd(), 'node_modules'),
  ];

  // Set-up a NodeVM with the limititations
  const vm = new NodeVM({
    sandbox: { leemons, utils },
    require: {
      external: true,
      // Run every imported file inside the VM
      context: 'sandbox',
      root,
      // Allow the following node-builtin modules
      builtin: [
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
        'util',
      ],
      // Ensure a protected use of FS (only access inside the given directory)
      mock: {
        fs: protect(allowedPath)(),
      },
    },
  });

  return vm;
};

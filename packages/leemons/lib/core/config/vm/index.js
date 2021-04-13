const { NodeVM } = require('vm2');
const path = require('path');
const utils = require('leemons-utils');

const protect = require('./protect');

module.exports = (allowedPath) => {
  const root = [
    allowedPath,
    path.resolve(leemons.dir ? leemons.dir.app : process.cwd(), 'node_modules'),
  ];

  const vm = new NodeVM({
    sandbox: { leemons, utils },
    require: {
      external: true,
      context: 'sandbox',
      root,
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
      mock: {
        fs: protect(allowedPath)(),
      },
    },
  });

  return vm;
};

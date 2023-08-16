const _ = require('lodash');
const { table } = require('../tables');

async function saveGeneral(config, { transacting } = {}) {
  await table.config.set(
    { type: 'general' },
    {
      type: 'general',
      config: JSON.stringify(config),
    },
    { transacting }
  );
  leemons.socket.emitToAll(`COMUNICA:CONFIG:GENERAL`, config);

  return config;
}

module.exports = { saveGeneral };

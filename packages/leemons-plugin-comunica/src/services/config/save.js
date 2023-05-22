const { table } = require('../tables');
const { get } = require('./get');

async function save(userAgent, config, { transacting } = {}) {
  const result = await table.userAgentConfig.set(
    { userAgent },
    { userAgent, ...config },
    { transacting }
  );
  leemons.socket.emit(userAgent, `COMUNICA:CONFIG`, await get(userAgent, { transacting }));
  return result;
}

module.exports = { save };

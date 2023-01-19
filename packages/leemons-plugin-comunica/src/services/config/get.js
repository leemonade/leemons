const { table } = require('../tables');

async function get(userAgent, { transacting } = {}) {
  const config = await table.userAgentConfig.findOne({ userAgent }, { transacting });
  return {
    muted: config?.muted ? !!config.muted : false,
  };
}

module.exports = { get };

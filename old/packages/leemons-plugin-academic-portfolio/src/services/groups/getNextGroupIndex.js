const { table } = require('../tables');

async function getNextGroupIndex(program, { transacting } = {}) {
  const config = await table.configs.findOne(
    { key: `program-${program}-group-index` },
    { transacting }
  );
  if (!config) return 1;
  return parseInt(config.value, 10) + 1;
}

module.exports = { getNextGroupIndex };

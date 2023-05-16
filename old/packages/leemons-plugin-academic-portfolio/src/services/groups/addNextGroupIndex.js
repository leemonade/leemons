const { table } = require('../tables');
const { getNextGroupIndex } = require('./getNextGroupIndex');

async function addNextGroupIndex(program, { index, transacting } = {}) {
  let goodIndex = index;
  if (!index) {
    goodIndex = await getNextGroupIndex(program, { transacting });
  }
  await table.configs.set(
    { key: `program-${program}-group-index` },
    { key: `program-${program}-group-index`, value: goodIndex.toString() },
    { transacting }
  );
  return goodIndex;
}

module.exports = { addNextGroupIndex };

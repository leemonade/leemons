const { isArray, map } = require('lodash');
const { tables } = require('../tables');

async function getAssetsByProgram(program, { assets, transacting }) {
  const programs = isArray(program) ? program : [program];
  const query = {
    program_$in: programs,
  };
  if (isArray(assets) && assets.length) {
    query.id_$in = assets;
  } else {
    return [];
  }
  const _assets = await tables.assets.find(query, { columns: ['id'], transacting });
  return map(_assets, 'id');
}

module.exports = { getAssetsByProgram };

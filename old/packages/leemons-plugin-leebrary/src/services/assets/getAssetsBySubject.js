const { isArray, map, uniq } = require('lodash');
const { tables } = require('../tables');

async function getAssetsBySubject(subject, { assets, transacting }) {
  const subjects = isArray(subject) ? subject : [subject];
  const query = {};
  if (subjects.length) {
    query.subject_$in = subjects;
  }
  if (isArray(assets) && assets.length) {
    query.asset_$in = assets;
  } else {
    return [];
  }
  const _assets = await tables.assetsSubjects.find(query, { columns: ['asset'], transacting });
  return uniq(map(_assets, 'asset'));
}

module.exports = { getAssetsBySubject };

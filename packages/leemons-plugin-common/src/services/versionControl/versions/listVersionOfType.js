const _ = require('lodash');
const list = require('../currentVersions/list');
const { parseId, stringifyId, stringifyVersion } = require('../helpers');
const getVersion = require('./getVersion');
const {
  table: { versions },
} = require('../../tables');

function getDesiredVersion(current, published, preferCurrent) {
  if (current && preferCurrent && (published === true || published === 'all')) {
    return current;
  }

  if (published === 'all') {
    return 'latest';
  }

  if (published === false) {
    return 'draft';
  }
  return 'published';
}

module.exports = async function listVersionOfType(
  type,
  { allVersions = false, published = 'all', transacting, preferCurrent = true } = {}
) {
  const listOfEntities = await list.bind(this)(type, {
    transacting,
  });

  if (allVersions) {
    const foundVersions = await versions.find(
      {
        uuid_$in: listOfEntities.map((entity) => entity.uuid),
      },
      { transacting }
    );

    const fullIds = foundVersions.map((v) => stringifyId(v.uuid, stringifyVersion(v)));

    const result = await getVersion.call(this, fullIds, { transacting });

    return _.compact(result);
  }

  const parsedIds = parseId(
    listOfEntities.map((entity) => ({
      uuid: entity.uuid,
      version: getDesiredVersion(entity.current, published, preferCurrent),
    })),
    { transacting }
  );

  const result = await getVersion(
    parsedIds.map((id) => id.fullId),
    { transacting }
  );

  return _.compact(result);
};

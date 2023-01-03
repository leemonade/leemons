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

    const result = await getVersion.call(this, fullIds, { ignoreMissing: true, transacting });

    return _.compact(result);
  }

  const parsedIds = (
    await parseId(
      listOfEntities.map((entity) => ({
        id: entity.uuid,
        version: getDesiredVersion(entity.current, published, preferCurrent),
      })),
      { ignoreMissing: true, transacting }
    )
  ).filter(Boolean);

  const result = await getVersion.call(
    this,
    parsedIds.map((id) => id.fullId),
    { transacting }
  );

  return _.compact(result);
};

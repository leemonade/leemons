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

    const result = await Promise.all(
      foundVersions.map(async (v) => {
        const fullId = stringifyId(v.uuid, stringifyVersion(v));

        const version = await getVersion.call(this, fullId, { transacting });

        return version;
      })
    );

    return _.compact(result);
  }

  const result = await Promise.all(
    listOfEntities.map(async (entity) => {
      try {
        const { fullId } = await parseId.call(
          this,
          entity.uuid,
          getDesiredVersion(entity.current, published, preferCurrent),
          {
            transacting,
          }
        );

        return getVersion.bind(this)(fullId, { transacting });
      } catch (error) {
        if (error.message === 'Version not found') {
          return null;
        }
        throw error;
      }
    })
  );
  return _.compact(result);
};

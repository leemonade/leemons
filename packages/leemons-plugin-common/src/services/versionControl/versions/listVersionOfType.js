const _ = require('lodash');
const list = require('../currentVersions/list');
const { parseId } = require('../helpers');
const getVersion = require('./getVersion');

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
  { published = 'all', transacting, preferCurrent = true } = {}
) {
  const listOfEntities = await list.bind(this)(type, {
    transacting,
  });

  const result = await Promise.all(
    listOfEntities.map(async (entity) => {
      try {
        const { fullId } = await parseId(
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

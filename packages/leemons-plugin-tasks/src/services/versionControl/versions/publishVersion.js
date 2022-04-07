const { versions } = require('../../table');
const { parseId } = require('../helpers');
const getVersion = require('./getVersion');

module.exports = async function publishVersion(id, publish = true, { version, transacting } = {}) {
  const { fullId } = await parseId(id, version);
  try {
    const versionToUpdate = await getVersion(id, { published: !publish, version, transacting });

    await versions.update(
      {
        id: versionToUpdate.id,
      },
      {
        published: publish,
      }
    );

    return { fullId, published: publish };
  } catch (e) {
    throw new Error(
      `Could not publish ${fullId} as it does not exist or is already ${
        publish ? 'published' : 'in draft'
      }`
    );
  }
};

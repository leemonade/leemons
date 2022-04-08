const { versions } = require('../../table');
const { parseId } = require('../helpers');
const getVersion = require('./getVersion');

module.exports = async function publishVersion(
  id,
  publish = true,
  { version: v, transacting } = {}
) {
  const { fullId } = await parseId(id, v);
  let _id;
  try {
    const versionToUpdate = await getVersion(fullId, { transacting });

    _id = versionToUpdate.id;

    if (versionToUpdate.published === publish) {
      throw new Error('already published');
    }
  } catch (e) {
    if (e.message === 'already published') {
      throw new Error(
        `Could not publish ${fullId} as it is already ${publish ? 'published' : 'in draft'}`
      );
    }
    throw new Error(`Could not publish ${fullId} as it does not exist`);
  }

  await versions.update(
    {
      id: _id,
    },
    {
      published: publish,
    },
    { transacting }
  );

  return { fullId, published: publish };
};

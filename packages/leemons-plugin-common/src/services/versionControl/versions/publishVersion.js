const {
  table: { versions },
} = require('../../tables');
const get = require('../currentVersions/get');
const update = require('../currentVersions/update');
const { parseId, parseVersion } = require('../helpers');
const getVersion = require('./getVersion');

module.exports = async function publishVersion(
  id,
  publish = true,
  { version: v, setAsCurrent, transacting } = {}
) {
  const { fullId, uuid, version } = await parseId({ id, version: v });
  let versionToUpdate;
  try {
    versionToUpdate = await getVersion.bind(this)(fullId, { transacting });

    if (versionToUpdate.published === publish) {
      throw new Error('already published');
    }
  } catch (e) {
    if (e.message === 'already published') {
      throw new Error(
        `Could not publish ${fullId} as it is already ${publish ? 'published' : 'in draft'}`
      );
    }
    throw new Error(
      `Could not publish ${fullId} as it does not exist or you don't have permissions`
    );
  }

  try {
    const currentVersions = get.bind(this)(uuid, { transacting });

    if (currentVersions.current === version) {
      throw new Error("Can't modify status of current version");
    }
  } catch (e) {
    throw new Error(`Could not publish ${fullId} as it is not versioned`);
  }

  const versionObject = parseVersion(versionToUpdate.version);

  await versions.update(
    {
      uuid: versionToUpdate.uuid,
      ...versionObject,
    },
    {
      published: Boolean(publish),
    },
    { transacting }
  );

  if (publish && setAsCurrent) {
    await update.bind(this)(uuid, version, { transacting });
  }

  return { fullId, published: publish };
};

const { LeemonsError } = require('leemons-error');
const get = require('../currentVersions/get');
const update = require('../currentVersions/update');
const { parseId, parseVersion } = require('../helpers');
const getVersion = require('./getVersion');

module.exports = async function publishVersion({
  id,
  publish = true,
  version: v,
  setAsCurrent,
  ctx,
}) {
  const { fullId, uuid, version } = await parseId({ id: { id, version: v }, ctx });
  let versionToUpdate;
  try {
    versionToUpdate = await getVersion({ id: fullId, ctx });

    if (versionToUpdate.published === publish) {
      throw new LeemonsError(ctx, { message: 'already published' });
    }
  } catch (e) {
    if (e.message === 'already published') {
      throw new LeemonsError(ctx, {
        message: `Could not publish ${fullId} as it is already ${
          publish ? 'published' : 'in draft'
        }`,
      });
    }
    throw new LeemonsError(ctx, {
      message: `Could not publish ${fullId} as it does not exist or you don't have permissions`,
    });
  }

  try {
    const currentVersions = get({ uuid, ctx });

    if (currentVersions.current === version) {
      throw new LeemonsError(ctx, { message: "Can't modify status of current version" });
    }
  } catch (e) {
    throw new LeemonsError(ctx, { message: `Could not publish ${fullId} as it is not versioned` });
  }

  const versionObject = parseVersion({ version: versionToUpdate.version, ctx });

  await ctx.tx.db.Versions.findOneAndUpdate(
    {
      uuid: versionToUpdate.uuid,
      ...versionObject,
    },
    {
      published: Boolean(publish),
    }
  );

  if (publish && setAsCurrent) {
    await update({ uuid, version, ctx });
  }

  return { fullId, published: publish };
};

const { LeemonsError } = require('leemons-error');
const { stringifyVersion } = require('../helpers');
const getVersion = require('../versions/getVersion');

module.exports = async function update({ uuid, version, ctx }) {
  let v = version;

  if (v !== null && typeof v !== 'string') {
    v = await stringifyVersion({ ...version, ctx });
  }

  if (version !== null) {
    try {
      // EN: Validate if the version exists in the version control system, if not, it throws
      // ES: Valida si la versión existe en el sistema de control de versiones, si no, lanza un error
      await getVersion({ id: { id: uuid, version: v }, published: true, ctx });
    } catch (e) {
      throw new LeemonsError(ctx, {
        message: `The uuid ${uuid} does not have a version ${v} in the version control system, or is not published yet, or you don't have permissions`,
      });
    }
  }

  try {
    const versionedEntity = await ctx.tx.db.CurrentVersions.findOneAndUpdate(
      {
        id: uuid,
      },
      {
        published: v,
      },
      { new: true, lean: true }
    );

    return { uuid: versionedEntity.id, currentPublished: versionedEntity.published };
  } catch (e) {
    throw new LeemonsError(ctx, {
      message: `The uuid ${uuid} does not exist in the version control system`,
    });
  }
};

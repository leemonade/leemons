const { LeemonsError } = require('leemons-error');
const get = require('../currentVersions/get');
const { parseId, stringifyVersion } = require('../helpers');

module.exports = async function listVersions({ id, published = 'all', ctx }) {
  const { uuid } = await parseId({ id: { id, version: '1.0.0' }, ctx });

  if (!['all', false, true].includes(published)) {
    throw new LeemonsError(ctx, {
      message: 'The published parameter must be one of: all, false, true',
    });
  }

  // EN: Verify if entity exists or the user has permissions to list versions
  // ES: Verifica si existe el entidad o si el usuario tiene permisos para listar versiones
  await get({ uuid, ctx });

  const query = {
    uuid,
  };

  if (published !== 'all') {
    query.published = published;
  }

  const results = await ctx.tx.db.Versions.find(query).lean();

  return Promise.all(
    results.map(async (result) => {
      const version = stringifyVersion({ ...result, ctx });
      const { fullId } = await parseId({ id: { id: result.uuid, version }, ctx });

      return {
        uuid,
        version,
        fullId,
        published: Boolean(result.published),
      };
    })
  );
};

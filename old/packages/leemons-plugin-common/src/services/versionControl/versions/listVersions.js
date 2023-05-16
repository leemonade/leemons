const {
  table: { versions },
} = require('../../tables');
const get = require('../currentVersions/get');
const { parseId, stringifyVersion } = require('../helpers');

module.exports = async function listVersions(id, { published = 'all', transacting } = {}) {
  const { uuid } = await parseId({ id, version: '1.0.0' });

  if (!['all', false, true].includes(published)) {
    throw new Error('The published parameter must be one of: all, false, true');
  }

  // EN: Verify if entity exists or the user has permissions to list versions
  // ES: Verifica si existe el entidad o si el usuario tiene permisos para listar versiones
  await get.bind(this)(uuid, { transacting });

  const query = {
    uuid,
  };

  if (published !== 'all') {
    query.published = published;
  }

  const results = await versions.find(query, { transacting });

  return Promise.all(
    results.map(async (result) => {
      const version = stringifyVersion(result);
      const { fullId } = await parseId({ id: result.uuid, version });

      return {
        uuid,
        version,
        fullId,
        published: Boolean(result.published),
      };
    })
  );
};

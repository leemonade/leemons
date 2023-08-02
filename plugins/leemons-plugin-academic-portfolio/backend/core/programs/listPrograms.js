const _ = require('lodash');
const { table } = require('../tables');

async function listPrograms(page, size, center, { userSession, transacting } = {}) {
  const programCenter = await table.programCenter.find({ center }, { transacting });
  const results = await global.utils.paginate(
    table.programs,
    page,
    size,
    { id_$in: _.map(programCenter, 'program') },
    {
      transacting,
    }
  );

  const assetService = leemons.getPlugin('leebrary').services.assets;
  const images = await assetService.getByIds(_.map(results.items, 'image'), {
    withFiles: true,
    userSession,
    transacting,
  });
  const imagesById = _.keyBy(images, 'id');

  const centersByProgram = _.groupBy(programCenter, 'program');
  results.items = results.items.map((program) => ({
    ...program,
    image: imagesById[program.image],
    centers: centersByProgram[program.id] ? _.map(centersByProgram[program.id], 'center') : [],
  }));
  return results;
}

module.exports = { listPrograms };

const _ = require('lodash');
const { mongoDBPaginate } = require('leemons-mongodb-helpers');

async function listPrograms({ page, size, center, ctx }) {
  // TODO Migration: Cuidado, antes había un userSession optativo como parámetro
  const programCenter = await ctx.tx.db.ProgramCenter.find({ center }).lean();

  const results = await mongoDBPaginate({
    model: ctx.tx.db.Class,
    page,
    size,
    query: { id: _.map(programCenter, 'program') },
  });

  const images = await ctx.tx.call('leebrary.assets.getByIds', {
    assetsIds: _.map(results.items, 'image'),
    withFiles: true,
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

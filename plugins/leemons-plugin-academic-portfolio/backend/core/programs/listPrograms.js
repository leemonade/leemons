const _ = require('lodash');
const { mongoDBPaginate } = require('@leemons/mongodb-helpers');
const { LeemonsError } = require('@leemons/error');
const { getUserProgramIds } = require('./getUserProgramIds');

async function listPrograms({ page, size, center, filters = {}, bringOnlyArchived, ctx }) {
  const queriesOptions = bringOnlyArchived ? { excludeDeleted: false } : {};
  const [profile, programCenter] = await Promise.all([
    ctx.tx.call('users.profiles.getProfileSysName'),
    ctx.tx.db.ProgramCenter.find({ center }, '', queriesOptions).lean(),
  ]);

  if (!['teacher', 'student', 'admin', 'super'].includes(profile)) {
    throw new LeemonsError(ctx, { message: 'Only teacher|student|admin|super can list programs' });
  }

  let programIds = _.map(programCenter, 'program');

  if (profile === 'teacher' || profile === 'student') {
    const _programIds = await getUserProgramIds({ ctx });
    programIds = _.intersection(_programIds, programIds);
  }

  const results = await mongoDBPaginate({
    model: ctx.tx.db.Programs,
    page,
    size,
    query: { ...filters, id: programIds },
    options: queriesOptions,
  });

  const images = await ctx.tx.call('leebrary.assets.getByIds', {
    ids: _.map(results.items, 'image'),
    withFiles: true,
  });
  const imagesById = _.keyBy(images, 'id');

  const centersByProgram = _.groupBy(programCenter, 'program');
  results.items = results.items.map((program) => ({
    ...program,
    image: imagesById[program.image],
    centers: centersByProgram[program.id] ? _.map(centersByProgram[program.id], 'center') : [],
  }));

  if (bringOnlyArchived) {
    results.items = results.items.filter((program) => program.isDeleted);
  }
  return results;
}

module.exports = { listPrograms };

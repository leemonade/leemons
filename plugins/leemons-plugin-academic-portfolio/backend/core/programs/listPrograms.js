const { checkRequiredPermissions } = require('@leemons/middlewares');
const { mongoDBPaginate } = require('@leemons/mongodb-helpers');
const _ = require('lodash');

const { getUserProgramIds } = require('./getUserProgramIds');

async function listPrograms({
  page,
  size,
  center,
  filters = {},
  teacherTypeFilter,
  onlyArchived,
  ctx,
}) {
  const queriesOptions = onlyArchived ? { excludeDeleted: false } : {};
  const [profile, programCenter] = await Promise.all([
    ctx.tx.call('users.profiles.getProfileSysName'),
    ctx.tx.db.ProgramCenter.find({ center }, '', queriesOptions).lean(),
  ]);

  await checkRequiredPermissions({
    allowedPermissions: {
      'academic-portfolio.programs': {
        actions: ['view', 'admin'],
      },
    },
    ctx,
  });

  let programIds = _.map(programCenter, 'program');

  if (profile === 'teacher' || profile === 'student') {
    const _programIds = await getUserProgramIds({ ctx, teacherTypeFilter });
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

  if (onlyArchived) {
    results.items = results.items.filter((program) => program.isDeleted);
  }
  return results;
}

module.exports = { listPrograms };

const _ = require('lodash');
const { table } = require('../tables');
const { getUserProgramIds } = require('./getUserProgramIds');

async function listPrograms(page, size, center, { userSession, transacting } = {}) {
  const [profile, programCenter] = await Promise.all([
    leemons.getPlugin('users').services.profiles.getProfileSysName(userSession, { transacting }),
    table.programCenter.find({ center }, { transacting }),
  ]);

  if (!['teacher', 'student', 'admin'].includes(profile)) {
    throw new Error('Only teacher|student|admin can list programs');
  }

  let programIds = _.map(programCenter, 'program');

  if (profile === 'teacher' || profile === 'student') {
    const _programIds = await getUserProgramIds(userSession, { transacting });
    programIds = _.intersection(_programIds, programIds);
  }

  const results = await global.utils.paginate(
    table.programs,
    page,
    size,
    { id_$in: programIds },
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

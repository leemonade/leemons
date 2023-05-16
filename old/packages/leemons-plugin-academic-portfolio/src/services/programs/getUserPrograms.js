const { keyBy, map } = require('lodash');
const { table } = require('../tables');
const { getUserProgramIds } = require('./getUserProgramIds');

async function getUserPrograms(userSession, { transacting } = {}) {
  const programIds = await getUserProgramIds(userSession, { transacting });
  const programs = await table.programs.find({ id_$in: programIds }, { transacting });

  const assetService = leemons.getPlugin('leebrary').services.assets;
  const images = await assetService.getByIds(map(programs, 'image'), {
    withFiles: true,
    userSession,
    transacting,
  });
  const imagesById = keyBy(images, 'id');

  return programs.map((program) => ({ ...program, image: imagesById[program.image] }));
}

module.exports = { getUserPrograms };

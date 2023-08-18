const { keyBy, map } = require('lodash');
const { getUserProgramIds } = require('./getUserProgramIds');

async function getUserPrograms({ ctx }) {
  const { userSession } = ctx.meta;

  const programIds = await getUserProgramIds({ userSession, ctx });
  const programs = await ctx.tx.db.Programs.find({ id: programIds }).lean();

  const images = await ctx.tx.call('leebrary.assets.getByIds', {
    assetsIds: map(programs, 'image'),
    withFiles: true,
  });

  const imagesById = keyBy(images, 'id');

  return programs.map((program) => ({ ...program, image: imagesById[program.image] }));
}

module.exports = { getUserPrograms };

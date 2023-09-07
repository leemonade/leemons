const _ = require('lodash');
const { validateAddCurriculum } = require('../../validations/forms');
const { curriculumByIds } = require('./curriculumByIds');

async function addCurriculum({ data, ctx }) {
  validateAddCurriculum(data);
  let curriculum = await ctx.tx.db.Curriculums.create({ ...data, step: 1 });
  curriculum = curriculum.toObject();
  return (await curriculumByIds({ ids: curriculum.id }))[0];
}

module.exports = { addCurriculum };

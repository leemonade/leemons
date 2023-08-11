const _ = require('lodash');
const { table } = require('../tables');
const { validateAddCurriculum } = require('../../validations/forms');
const { curriculumByIds } = require('./curriculumByIds');

async function addCurriculum(data, { transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      validateAddCurriculum(data);
      const curriculum = await table.curriculums.create({ ...data, step: 1 }, { transacting });
      return (await curriculumByIds(curriculum.id, { transacting }))[0];
    },
    table.curriculums,
    _transacting
  );
}

module.exports = { addCurriculum };

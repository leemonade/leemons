const _ = require('lodash');
const { table } = require('../tables');

async function publishCurriculum(curriculumId, { transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) =>
      table.curriculums.update({ id: curriculumId }, { published: true }, { transacting }),
    table.curriculums,
    _transacting
  );
}

module.exports = { publishCurriculum };

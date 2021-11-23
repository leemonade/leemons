const _ = require('lodash');
const { table } = require('../tables');
const { validateAddGradeTag } = require('../../validations/forms');
const { getGradeTagsByIds } = require('./getGradeTagsByIds');

async function addGradeTag(data, { transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      await validateAddGradeTag(data, { transacting });
      const tag = await table.gradeTags.create(data, { transacting });
      return (await getGradeTagsByIds(tag.id, { transacting }))[0];
    },
    table.gradeTags,
    _transacting
  );
}

module.exports = { addGradeTag };

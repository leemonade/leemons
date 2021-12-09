const _ = require('lodash');
const { table } = require('../tables');
const { validateUpdateGradeTag } = require('../../validations/forms');
const { getGradeTagsByIds } = require('./getGradeTagsByIds');

async function updateGradeTag(data, { transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      await validateUpdateGradeTag(data, { transacting });
      const { id, ..._data } = data;
      await table.gradeTags.update({ id }, _data, { transacting });
      return (await getGradeTagsByIds(id, { transacting }))[0];
    },
    table.gradeTags,
    _transacting
  );
}

module.exports = { updateGradeTag };

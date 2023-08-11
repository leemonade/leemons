const _ = require('lodash');
const { table } = require('../tables');

async function removeGradeTag(id, { transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      const gradeTags = await table.gradeTags.find(
        { id_$in: _.isArray(id) ? id : [id] },
        { transacting }
      );

      const gradeTagIds = _.map(gradeTags, 'id');

      await leemons.events.emit('before-remove-grade-tags', { gradeTags, transacting });

      await table.gradeTags.delete({ id_$in: gradeTagIds }, { transacting });

      await leemons.events.emit('after-remove-grade-tags', { gradeTags, transacting });

      return true;
    },
    table.grades,
    _transacting
  );
}

module.exports = { removeGradeTag };

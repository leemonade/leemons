const _ = require('lodash');
const { table } = require('../../tables');

async function changeBySubject(subjectId, knowledge, { transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      const classes = await table.class.find(
        { subject: subjectId },
        { columns: ['id'], transacting }
      );
      return table.classKnowledges.updateMany(
        { class_$in: _.map(classes, 'id') },
        { knowledge },
        { transacting }
      );
    },
    table.classKnowledges,
    _transacting
  );
}

module.exports = { changeBySubject };

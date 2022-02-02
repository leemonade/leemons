const _ = require('lodash');
const { table } = require('../../tables');

async function removeByClass(classIds, { soft, transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      const classKnowledges = await table.classKnowledges.find(
        { class_$in: _.isArray(classIds) ? classIds : [classIds] },
        { transacting }
      );
      await leemons.events.emit('before-remove-classes-knowledges', {
        classKnowledges,
        soft,
        transacting,
      });

      await table.classKnowledges.deleteMany(
        { id_$in: _.map(classKnowledges, 'id') },
        { soft, transacting }
      );
      await leemons.events.emit('after-remove-classes-knowledges', {
        classKnowledges,
        soft,
        transacting,
      });
      return true;
    },
    table.classKnowledges,
    _transacting
  );
}

module.exports = { removeByClass };

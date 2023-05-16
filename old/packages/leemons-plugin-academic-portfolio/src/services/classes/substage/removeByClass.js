const _ = require('lodash');
const { table } = require('../../tables');

async function removeByClass(classIds, { soft, transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      const classSubstages = await table.classSubstage.find(
        { class_$in: _.isArray(classIds) ? classIds : [classIds] },
        { transacting }
      );
      await leemons.events.emit('before-remove-classes-substages', {
        classSubstages,
        soft,
        transacting,
      });
      await table.classSubstage.deleteMany(
        { id_$in: _.map(classSubstages, 'id') },
        { soft, transacting }
      );
      await leemons.events.emit('after-remove-classes-substages', {
        classSubstages,
        soft,
        transacting,
      });
      return true;
    },
    table.classSubstage,
    _transacting
  );
}

module.exports = { removeByClass };

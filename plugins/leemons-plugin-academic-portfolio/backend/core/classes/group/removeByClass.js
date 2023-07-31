const _ = require('lodash');
const { table } = require('../../tables');

async function removeByClass(classIds, { soft, transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      const classGroups = await table.classGroup.find(
        { class_$in: _.isArray(classIds) ? classIds : [classIds] },
        { transacting }
      );
      await leemons.events.emit('before-remove-classes-groups', { classGroups, soft, transacting });
      await table.classGroup.deleteMany(
        { id_$in: _.map(classGroups, 'id') },
        { soft, transacting }
      );
      await leemons.events.emit('after-remove-classes-groups', { classGroups, soft, transacting });
      return true;
    },
    table.classGroup,
    _transacting
  );
}

module.exports = { removeByClass };

const _ = require('lodash');
const { table } = require('../tables');
const { getClassesUnderNodeTree } = require('../common/getClassesUnderNodeTree');
const { getProgramTreeTypes } = require('../programs/getProgramTreeTypes');

async function removeGroupFromClassesUnderNodeTree(groupId, { transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      const group = await table.groups.findOne({ id: groupId }, { transacting });
      const nodeTypes = await getProgramTreeTypes(group.program, { transacting });
      const classes = await getClassesUnderNodeTree(nodeTypes, 'groups', groupId, { transacting });
      await leemons.events.emit('before-remove-groups-from-classes', {
        groupId,
        classes,
        transacting,
      });
      await table.classGroup.deleteMany(
        { group: groupId, class_$in: _.map(classes, 'id') },
        { transacting }
      );
      await leemons.events.emit('after-remove-groups-from-classes', {
        groupId,
        classes,
        transacting,
      });
      return true;
    },
    table.groups,
    _transacting
  );
}

module.exports = { removeGroupFromClassesUnderNodeTree };

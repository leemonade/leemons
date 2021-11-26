const { addGroup } = require('./addGroup');
const { listGroups } = require('./listGroups');
const { updateGroup } = require('./updateGroup');
const { addNextGroupIndex } = require('./addNextGroupIndex');
const { getNextGroupIndex } = require('./getNextGroupIndex');
const { removeGroupFromClassesUnderNodeTree } = require('./removeGroupFromClassesUnderNodeTree');
const {
  duplicateGroupWithClassesUnderNodeTreeByIds,
} = require('./duplicateGroupWithClassesUnderNodeTreeByIds');

module.exports = {
  addGroup,
  listGroups,
  updateGroup,
  addNextGroupIndex,
  getNextGroupIndex,
  removeGroupFromClassesUnderNodeTree,
  duplicateGroupWithClassesUnderNodeTreeByIds,
};

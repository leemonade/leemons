const { addGroup } = require('./addGroup');
const { listGroups } = require('./listGroups');
const { updateGroup } = require('./updateGroup');
const { duplicateGroup } = require('./duplicateGroup');
const { addNextGroupIndex } = require('./addNextGroupIndex');
const { getNextGroupIndex } = require('./getNextGroupIndex');
const { addGroupIfNotExists } = require('./addGroupIfNotExists');
const { removeGroupFromClassesUnderNodeTree } = require('./removeGroupFromClassesUnderNodeTree');
const {
  duplicateGroupWithClassesUnderNodeTreeByIds,
} = require('./duplicateGroupWithClassesUnderNodeTreeByIds');

module.exports = {
  addGroup,
  listGroups,
  updateGroup,
  duplicateGroup,
  addNextGroupIndex,
  getNextGroupIndex,
  addGroupIfNotExists,
  removeGroupFromClassesUnderNodeTree,
  duplicateGroupWithClassesUnderNodeTreeByIds,
};

const { addGroup } = require('./addGroup');
const { listGroups } = require('./listGroups');
const { updateGroup } = require('./updateGroup');
const { addNextGroupIndex } = require('./addNextGroupIndex');
const { getNextGroupIndex } = require('./getNextGroupIndex');

module.exports = {
  addGroup,
  listGroups,
  updateGroup,
  addNextGroupIndex,
  getNextGroupIndex,
};

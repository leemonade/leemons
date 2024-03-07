const { list } = require('./list');
const { save } = require('./save');
const { byIds } = require('./byIds');
const { addView } = require('./addView');
const { addClick } = require('./addClick');
const { getActive } = require('./getActive');
const { getOverlapsWithOtherConfigurations } = require('./getOverlapsWithOtherConfigurations');

module.exports = {
  list,
  save,
  byIds,
  addView,
  addClick,
  getActive,
  getOverlapsWithOtherConfigurations,
};

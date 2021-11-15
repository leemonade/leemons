const { table } = require('../../tables');

async function removeByClass(_class, { transacting } = {}) {
  return table.classGroup.deleteMany({ class: _class }, { transacting });
}

module.exports = { removeByClass };

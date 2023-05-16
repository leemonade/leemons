const { table } = require('../../tables');

async function add(_class, group, { transacting } = {}) {
  return table.classGroup.create({ class: _class, group }, { transacting });
}

module.exports = { add };

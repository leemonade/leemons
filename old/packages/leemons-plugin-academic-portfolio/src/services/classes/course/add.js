const { table } = require('../../tables');

async function add(_class, course, { transacting } = {}) {
  return table.classCourse.create({ class: _class, course }, { transacting });
}

module.exports = { add };

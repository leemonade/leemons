const { table } = require('../../tables');

async function add(_class, teacher, type, { transacting } = {}) {
  return table.classTeacher.create({ class: _class, teacher, type }, { transacting });
}

module.exports = { add };

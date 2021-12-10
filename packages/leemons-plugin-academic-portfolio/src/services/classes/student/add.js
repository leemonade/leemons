const { table } = require('../../tables');

async function add(_class, student, { transacting } = {}) {
  return table.classStudent.create({ class: _class, student }, { transacting });
}

module.exports = { add };

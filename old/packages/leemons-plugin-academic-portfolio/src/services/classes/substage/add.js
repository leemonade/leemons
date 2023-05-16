const { table } = require('../../tables');

async function add(_class, substage, { transacting } = {}) {
  return table.classSubstage.create({ class: _class, substage }, { transacting });
}

module.exports = { add };

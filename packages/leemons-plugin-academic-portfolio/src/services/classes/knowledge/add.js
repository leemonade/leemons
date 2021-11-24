const { table } = require('../../tables');

async function add(_class, knowledge, { transacting } = {}) {
  return table.classKnowledges.create({ class: _class, knowledge }, { transacting });
}

module.exports = { add };

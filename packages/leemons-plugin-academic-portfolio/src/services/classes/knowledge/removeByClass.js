const { table } = require('../../tables');

async function removeByClass(_class, { transacting } = {}) {
  return table.classKnowledges.deleteMany({ class: _class }, { transacting });
}

module.exports = { removeByClass };

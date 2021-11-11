const { table } = require('../../tables');

async function removeByClass(_class, { transacting } = {}) {
  return table.classSubstage.delete({ class: _class }, { transacting });
}

module.exports = { removeByClass };

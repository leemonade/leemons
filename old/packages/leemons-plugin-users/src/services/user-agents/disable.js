const { table } = require('../tables');

async function disable(id, { transacting } = {}) {
  return table.userAgent.update({ id }, { disabled: true }, { transacting });
}

module.exports = {
  disable,
};

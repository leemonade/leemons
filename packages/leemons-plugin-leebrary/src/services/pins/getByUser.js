const { tables } = require('../tables');

async function getByUser({ userSession, transacting } = {}) {
  return tables.pins.find({ userAgent: userSession.userAgents[0].id }, { transacting });
}

module.exports = { getByUser };

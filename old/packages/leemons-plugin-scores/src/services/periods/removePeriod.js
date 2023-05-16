const { map } = require('lodash');
const { periods } = require('../tables');

module.exports = async function removePeriod(periodId, { transacting, userSession } = {}) {
  try {
    const period = await periods.findOne({ id: periodId }, { transacting });

    if (!period) {
      throw new Error('period not found');
    }

    const userAgents = map(userSession.userAgents, 'id');

    if (!userAgents.includes(period.createdBy)) {
      throw new Error('you are not the creator of this period');
    }

    return await periods.delete(
      {
        id: periodId,
      },
      { transacting }
    );
  } catch (e) {
    throw new Error(`Error removing period: ${e.message}`);
  }
};

const { map } = require('lodash');
const { periods } = require('../tables');

module.exports = async function listPeriods(
  { sort, page, size, ...query },
  { transacting, userSession }
) {
  const q = {
    $where: [query],
    $sort: sort,
  };

  if (q.public === false) {
    q.$where.push({
      createdBy_$in: map(userSession.userAgents, 'id'),
    });
  } else {
    q.$where.push({
      $or: [{ public: true }, { createdBy_$in: map(userSession.userAgents, 'id') }],
    });
  }

  try {
    return await global.utils.paginate(periods, page, size, q, {
      columns: '*',
      forceColumnsOnCount: true,
      transacting,
    });
  } catch (e) {
    throw new Error(`Error listing periods ${e.message}`);
  }
};

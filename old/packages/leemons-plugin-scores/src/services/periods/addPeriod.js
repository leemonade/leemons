const { pick, isString } = require('lodash');
const { validatePeriod } = require('../validation/validatePeriod');
const { periods } = require('../tables');

module.exports = async function addPeriod(period, { transacting, userSession }) {
  validatePeriod(period);

  const periodToSave = pick(period, [
    'center',
    'program',
    'course',
    'name',
    'startDate',
    'endDate',
    'public',
  ]);

  periodToSave.createdBy = userSession.userAgents[0].id;

  const savedPeriod = periods.create(
    {
      ...periodToSave,
      startDate: global.utils.sqlDatetime(periodToSave.startDate),
      endDate: global.utils.sqlDatetime(periodToSave.endDate),
      public: isString(periodToSave.public) ? periodToSave.public === 'true' : periodToSave.public,
    },
    {
      transacting,
    }
  );

  return savedPeriod;
};

const { pick, isString } = require('lodash');
const { sqlDatetime } = require('@leemons/utils');
const { validatePeriod } = require('../../validation/validatePeriod');

module.exports = async function addPeriod({ period, ctx }) {
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

  periodToSave.createdBy = ctx.meta.userSession.userAgents[0].id;

  return ctx.tx.db.Periods.create({
    ...periodToSave,
    startDate: sqlDatetime(periodToSave.startDate),
    endDate: sqlDatetime(periodToSave.endDate),
    public: isString(periodToSave.public) ? periodToSave.public === 'true' : periodToSave.public,
  }).then((r) => r.toObject());
};

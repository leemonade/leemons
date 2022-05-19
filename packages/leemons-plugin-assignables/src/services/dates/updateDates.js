const _ = require('lodash');
const getDiff = require('../../helpers/getDiff');
const getDates = require('./getDates');
const registerDates = require('./registerDates');
const unregisterDates = require('./unregisterDates');

module.exports = async function updateDates(type, instance, dates, { transacting } = {}) {
  const currentDates = await getDates(type, instance, { transacting });

  const newDates = _.defaults(dates, currentDates);

  const { diff, object } = getDiff(newDates, currentDates);

  const changedDates = _.pick(object, diff);

  const datesToRemove = _.pickBy(changedDates, (value) => value === null);
  const datesToAdd = _.pickBy(changedDates, (value) => value !== null);

  await unregisterDates(type, instance, _.keys(datesToRemove), { transacting });
  await registerDates(type, instance, datesToAdd, { transacting });

  return {
    type,
    instance,
    newDates: _.compact(newDates),
  };
};

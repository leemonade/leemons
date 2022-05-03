const _ = require('lodash');
const getDiff = require('../../helpers/getDiff');
const getDates = require('./getDates');
const registerDates = require('./registerDates');
const unregisterDates = require('./unregisterDates');

module.exports = async function updateDates(type, instance, dates, { transacting } = {}) {
  const currentDates = await getDates(type, instance, { transacting });

  const newDates = _.defaults(dates, currentDates);

  const datesToRemove = _.entries(newDates)
    .filter(([, date]) => date === null)
    .map(([name]) => name);
  const datesToAdd = _.difference(_.keys(newDates), _.keys(currentDates)).reduce(
    (acc, name) => ({ ...acc, [name]: newDates[name] }),
    {}
  );

  await unregisterDates(type, instance, datesToRemove, { transacting });
  await registerDates(type, instance, datesToAdd, { transacting });

  return {
    type,
    instance,
    newDates: _.compact(newDates),
  };
};

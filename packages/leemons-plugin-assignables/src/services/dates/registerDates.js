const _ = require('lodash');
const registerDate = require('./registerDate');

module.exports = async function registerDates(type, instance, dates, { transacting } = {}) {
  await Promise.all(
    _.map(dates, (date, name) => registerDate(type, instance, name, date, { transacting }))
  );

  return {
    type,
    instance,
    dates,
  };
};

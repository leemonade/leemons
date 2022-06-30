const { dates } = require('../tables');

module.exports = async function getDate(type, instance, name, { transacting } = {}) {
  const { date } = await dates.findOne({ type, instance, name }, { transacting });

  return date;
};

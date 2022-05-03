const { dates } = require('../tables');

module.exports = async function getDates(type, instance, { transacting } = {}) {
  const values = await dates.find({ type, instance }, { transacting });
  return values.reduce((acc, { name, date }) => ({ ...acc, [name]: date }), {});
};

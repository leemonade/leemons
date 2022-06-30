const { dates } = require('../tables');

module.exports = function unregisterDates(type, instance, name, { transacting } = {}) {
  const names = Array.isArray(name) ? name : [name].filter((n) => n);

  return dates.deleteMany({ type, instance, name_$in: names }, { transacting });
};

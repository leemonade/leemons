const { dates } = require('../services/tables');

module.exports = async function registeDate(type, instance, name, date, { transacting } = {}) {
  await dates.create(
    {
      type,
      instance,
      name,
      date: global.utils.sqlDatetime(date),
    },
    { transacting }
  );

  return {
    type,
    instance,
    name,
    date,
  };
};

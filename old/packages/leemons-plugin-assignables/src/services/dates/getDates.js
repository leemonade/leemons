const { dates } = require('../tables');

module.exports = async function getDates(type, instance, { transacting } = {}) {
  if (!Array.isArray(instance)) {
    const values = await dates.find({ type, instance }, { columns: ['name', 'date'], transacting });
    return values.reduce((acc, { name, date }) => ({ ...acc, [name]: date }), {});
  }
  const values = await dates.find(
    { type, instance_$in: instance },
    { columns: ['instance', 'name', 'date'], transacting }
  );

  return values.reduce(
    (acc, { instance: instanceId, name, date }) => ({
      ...acc,
      [instanceId]: {
        ...acc[instanceId],
        [name]: date,
      },
    }),
    {}
  );
};

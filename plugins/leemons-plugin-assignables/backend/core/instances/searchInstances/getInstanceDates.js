const { keyBy } = require('lodash');

async function getInstanceDates({ instances: instancesIds, ctx }) {
  const [assignableInstancesDates, instances] = await Promise.all([
    ctx.tx.db.Dates.find({
      instance: instancesIds,
      type: 'assignableInstance',
    }).lean(),
    ctx.tx.db.Instances.find({
      id: instancesIds,
    })
      .select({ _id: 0, id: 1, createdAt: 1 })
      .lean(),
  ]);

  const instancesByKey = keyBy(instances, 'id');

  return assignableInstancesDates.reduce((acc, dateObject) => {
    const { name, date, instance } = dateObject;

    return {
      ...acc,
      [instance]: {
        createdAt: instancesByKey[instance].createdAt,
        ...acc[instance],
        [name]: date,
      },
    };
  }, {});
}

module.exports = {
  getInstanceDates,
};

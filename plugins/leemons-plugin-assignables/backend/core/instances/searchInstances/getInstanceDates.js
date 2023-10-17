async function getInstanceDates({ instances, ctx }) {
  const assignableInstancesDates = await ctx.tx.db.Dates.find({
    instance: instances,
    type: 'assignableInstance',
  }).lean();

  return assignableInstancesDates.reduce((acc, dateObject) => {
    const { name, date, instance } = dateObject;

    return {
      ...acc,
      [instance]: {
        ...acc[instance],
        [name]: date,
      },
    };
  }, {});
}

module.exports = {
  getInstanceDates,
};

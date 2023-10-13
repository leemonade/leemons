/**
 * Retrieves the dates associated with the given assignations.
 *
 * @param {object} options - The options object.
 * @param {array} options.assignations - The assignations to retrieve dates for.
 * @param {MoleculerContext} options.ctx - The Moleculer context object.
 * @return {object} An object mapping assignation instances to an object containing the
 *                  associated dates.
 */
async function getAssignationsDates({ assignations, ctx }) {
  const datesFound = await ctx.tx.db.Dates.find({
    type: 'assignation',
    instance: assignations,
  })
    .select(['instance', 'name', 'date'])
    .lean();

  return datesFound.reduce((acc, date) => {
    acc[date.instance] = {
      ...acc[date.instance],
      [date.name]: date.date,
    };
    return acc;
  }, {});
}

module.exports = {
  getAssignationsDates,
};

const { orderBy } = require('lodash');

/*
  === SORTING ===
*/
function sortInstancesByDates({ instances, dates, filters }) {
  const { sort } = filters;
  const instanceDates = dates.instances;
  const sortedInstances = orderBy(instances, 'created_at', 'desc');

  if (['start', 'deadline'].includes(sort)) {
    return sortedInstances.sort((a, b) => {
      const aDate = instanceDates[a.id]?.[sort];
      const bDate = instanceDates[b.id]?.[sort];

      if (aDate && bDate) {
        return new Date(aDate) - new Date(bDate);
      }
      if (aDate && !bDate) {
        return -1;
      }
      if (bDate && !aDate) {
        return 1;
      }

      return 0;
    });
  }
  // Default: Sort by 'assignation'
  return sortedInstances;
}

module.exports = { sortInstancesByDates };

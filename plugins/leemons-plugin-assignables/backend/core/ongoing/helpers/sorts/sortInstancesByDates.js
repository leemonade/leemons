const { orderBy } = require('lodash');

function compareInstancesByDate(instanceDates, sort) {
  return (a, b) => {
    const aDate = instanceDates[a.id]?.[sort] ?? a?.dates?.[sort];
    const bDate = instanceDates[b.id]?.[sort] ?? b?.dates?.[sort];

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
  };
}

/*
  === SORTING ===
*/
function sortInstancesByDates({ instances, dates, filters = {} }) {
  const { sort } = filters;
  const instanceDates = dates?.instances ?? {};
  const sortedInstances = orderBy(instances, 'createdAt', 'desc');

  if (['start', 'deadline'].includes(sort)) {
    return sortedInstances.sort(compareInstancesByDate(instanceDates, sort));
  }
  // Default: Sort by 'assignation'
  return sortedInstances;
}

module.exports = { sortInstancesByDates };

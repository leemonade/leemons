/*
  === SORTING ===
*/
function sortInstancesByDates({ instances, dates, filters }) {
  let { sort } = filters;

  if (!['assignation', 'start', 'deadline'].includes(sort)) {
    sort = 'assignation';
  }

  const instanceDates = dates.instances;

  if (sort === 'assignation') {
    return instances.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }
  if (['start', 'deadline'].includes(sort)) {
    return instances.sort((a, b) => {
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

  return instances;
}

module.exports = { sortInstancesByDates };

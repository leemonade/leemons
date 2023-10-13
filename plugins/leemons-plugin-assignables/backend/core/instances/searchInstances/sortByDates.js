const dayjs = require('dayjs');

function sortByDates(instances, datesToSort) {
  // Sort by the given dates, if they are the same, use the next one.
  const datesToSortLength = datesToSort.length;
  return instances.sort((a, b) => {
    for (let i = 0; i < datesToSortLength; i++) {
      const dateToSort = datesToSort[i];
      const aDate = a[dateToSort];
      const bDate = b[dateToSort];
      const aDateMoment = dayjs(aDate || null);
      const bDateMoment = dayjs(bDate || null);

      if (aDateMoment.isValid() && !bDateMoment.isValid()) {
        return -1;
      }
      if (!aDateMoment.isValid() && bDateMoment.isValid()) {
        return 1;
      }

      if (aDateMoment.isAfter(bDateMoment)) {
        return 1;
      }
      if (aDateMoment.isBefore(bDateMoment)) {
        return -1;
      }
    }
    return 0;
  });
}

module.exports = {
  sortByDates,
};

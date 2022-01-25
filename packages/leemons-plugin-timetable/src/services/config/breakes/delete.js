const breaksTable = leemons.query('plugins_timetable::breaks');

// Delete the requested breaks based on the class parameter or break id
module.exports = function deleteBreak({ configId, id }, { transacting } = {}) {
  if (configId) {
    return breaksTable.deleteMany({ timetable: configId }, { transacting });
  }

  // Delete many if an array of ids is passed
  if (Array.isArray(id)) {
    return breaksTable.deleteMany({ id_$in: id }, { transacting });
  }

  // Delete one if an id is passed
  return breaksTable.deleteOne({ id }, { transacting });
};

// Delete the requested breaks based on the class parameter or break id
module.exports = function deleteBreak({ configId, id, ctx }) {
  if (configId) {
    return ctx.tx.db.Breaks.deleteMany({ timetable: configId });
  }

  // Delete many if an array of ids is passed
  if (Array.isArray(id)) {
    return ctx.tx.db.Breaks.deleteMany({ id: id });
  }

  // Delete one if an id is passed
  return ctx.tx.db.Breaks.deleteOne({ id });
};

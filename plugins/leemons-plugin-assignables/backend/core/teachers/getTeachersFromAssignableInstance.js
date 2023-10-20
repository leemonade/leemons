module.exports = async function getTeachersFromAssignableInstance({ assignableInstanceId, ctx }) {
  return ctx.tx.db.Teachers.find({
    assignableInstance: assignableInstanceId,
  })
    .select(['teacher', 'type'])
    .lean();
};

const { map, isArray, uniq } = require('lodash');

async function addPermissionsBetweenTeachers({ programId, ctx }) {
  const classes = await ctx.tx.db.Class.find({
    program: isArray(programId) ? programId : [programId],
  })
    .select(['id'])
    .lean();
  const teachers = await ctx.tx.db.ClassTeacher.find({ class: uniq(map(classes, 'id')) })
    .select(['teacher'])
    .lean();
  const teachersIds = uniq(map(teachers, 'teacher'));

  return ctx.tx.call('users.users.addUserAgentContacts', {
    fromUserAgent: teachersIds,
    toUserAgent: teachersIds,
    target: programId,
  });
}

module.exports = { addPermissionsBetweenTeachers };

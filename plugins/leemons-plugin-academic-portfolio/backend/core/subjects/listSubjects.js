const { mongoDBPaginate } = require('@leemons/mongodb-helpers');

const { getUserSubjectIds } = require('./getUserSubjectIds');

async function listSubjects({ page, size, program, course, onlyArchived, teacherTypeFilter, ctx }) {
  const query = {};
  if (course?.length > 0) {
    query.course = {
      $regex: new RegExp(course.join('|')),
    };
  }
  if (program?.length > 0) query.program = program;

  const results = await mongoDBPaginate({
    model: ctx.tx.db.Subjects,
    page,
    size,
    query,
    options: { ...(onlyArchived ? { excludeDeleted: false } : {}) },
  });

  if (teacherTypeFilter) {
    const [profile] = await Promise.all([ctx.tx.call('users.profiles.getProfileSysName')]);

    if (profile === 'teacher' || profile === 'student') {
      const subjectIds = await getUserSubjectIds({ ctx, teacherTypeFilter });
      results.items = results.items.filter((subject) => subjectIds.includes(subject.id));
    }
  }

  if (onlyArchived) {
    results.items = results.items.filter((subject) => subject.isDeleted);
  }
  return results;
}

module.exports = { listSubjects };

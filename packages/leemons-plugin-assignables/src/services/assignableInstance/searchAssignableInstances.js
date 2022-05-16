const { teachers, assignations } = require('../tables');

async function searchTeacherAssignableInstances(query, { userSession, transacting } = {}) {
  const userAgents = userSession.userAgents.map((userAgent) => userAgent.id);

  const results = await teachers.find({ teacher_$in: userAgents }, { transacting });

  return results.map((result) => result.assignableInstance);
}

async function searchStudentAssignableInstances(query, { userSession, transacting } = {}) {
  const userAgents = userSession.userAgents.map((userAgent) => userAgent.id);

  const results = await assignations.find({ user_$in: userAgents }, { transacting });

  return results.map((assignation) => assignation.instance);
}

module.exports = async function searchAssignableInstances(
  query,
  { userSession, transacting } = {}
) {
  const teacherResults = await searchTeacherAssignableInstances(query, {
    userSession,
    transacting,
  });

  if (!teacherResults.length) {
    return searchStudentAssignableInstances(query, { userSession, transacting });
  }

  return teacherResults;
};

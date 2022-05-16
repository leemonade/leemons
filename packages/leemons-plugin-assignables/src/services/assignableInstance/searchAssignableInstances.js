const _ = require('lodash');
const dayjs = require('dayjs');
const { getDates } = require('../dates');
const { teachers, assignations } = require('../tables');

async function searchTeacherAssignableInstances(query, { userSession, transacting } = {}) {
  const userAgents = userSession.userAgents.map((userAgent) => userAgent.id);

  const results = await teachers.find({ teacher_$in: userAgents }, { transacting });

  return results.map((result) => result.assignableInstance);
}

async function searchStudentAssignableInstances(query, { userSession, transacting } = {}) {
  const userAgents = userSession.userAgents.map((userAgent) => userAgent.id);

  const studentAssignations = await assignations.find({ user_$in: userAgents }, { transacting });

  let results = studentAssignations.map((assignation) => ({
    instance: assignation.instance,
    user: assignation.user,
  }));

  const instances = _.uniq(_.map(results, 'instance'));

  const instancesData = await instances.reduce(async (obj, instance) => {
    const dates = await getDates('assignableInstance', instance, { transacting });

    return {
      ...(await obj),
      [instance]: {
        dates,
      },
    };
  }, {});

  results = results.map((result) => ({
    ...result,
    dates: instancesData[result.instance].dates,
  }));

  // EN: Filter by dates visibility
  // ES: Filtra por fechas de visibilidad
  results = results.filter((result) => {
    const { dates } = result;

    const { start, deadline, visibility } = dates;

    if (!start || !deadline) {
      return true;
    }

    if (visibility) {
      if (dayjs(visibility).isAfter(dayjs())) {
        return false;
      }
    } else if (start && dayjs(start).isAfter(dayjs())) {
      return false;
    }

    return true;
  });

  // TODO: CHECK ORDER
  results.sort((a, b) => {
    const { dates: aDates } = a;
    const { dates: bDates } = b;

    if (aDates.deadline && bDates.deadline) {
      return dayjs(aDates.deadline).diff(dayjs(bDates.deadline));
    }

    if (aDates.deadline) {
      return 1;
    }

    if (bDates.deadline) {
      return -1;
    }

    return 0;
  });

  return results;
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

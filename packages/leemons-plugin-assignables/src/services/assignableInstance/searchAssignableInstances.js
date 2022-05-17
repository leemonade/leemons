const _ = require('lodash');
const dayjs = require('dayjs');
const { getDates } = require('../dates');
const { teachers, assignations } = require('../tables');

function sortByGivenDate(date) {
  return (a, b) => {
    const aDate = a[date];
    const bDate = b[date];

    if (!aDate && !bDate) {
      return 0;
    }

    if (!aDate) {
      return 1;
    }
    if (!bDate) {
      return -1;
    }

    return dayjs(aDate).diff(dayjs(bDate));
  };
}

function sortByGivenDates(instances, order) {
  return instances.sort((a, b) => {
    const { dates: aDates } = a;
    const { dates: bDates } = b;

    const orderLength = order.length;
    for (let i = 0; i < orderLength; i++) {
      const sortResult = sortByGivenDate(order[i])(aDates, bDates);

      if (sortResult !== 0) {
        return sortResult;
      }
    }

    return 0;
  });
}

function checkIfDateIsInRange(dates, min, max, defaultValue) {
  if (!dates.length) {
    return defaultValue;
  }

  return dates.some((date) => {
    if (!date) {
      return true;
    }

    if (!min && max) {
      return dayjs(date).isBefore(dayjs(max));
    }

    if (min && !max) {
      return dayjs(date).isAfter(dayjs(min));
    }

    return dayjs(date).isBetween(dayjs(min), dayjs(max));
  });
}

function filterByDates(instances, datesOptions) {
  const filteredInstances = instances.filter((instance) => {
    const everyDateIsInRange = _.every(datesOptions, (date) => {
      const { min, max, dates, default: defaultValue } = date;

      const datesToCheck = _.values(_.pick(instance.dates, dates));

      return checkIfDateIsInRange(datesToCheck, min, max, defaultValue);
    });

    return everyDateIsInRange;
  });

  return filteredInstances;
}

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
  const filteredResults = filterByDates(results, [
    {
      dates: ['visibility', 'start'],
      max: new Date(),
      default: true,
    },
    // TODO: Determine last day to see the task when deadline is exceeded
  ]);

  // TODO: CHECK ORDER
  const orderedResults = sortByGivenDates(filteredResults, ['deadline', 'start', 'visibility']);

  return orderedResults;
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

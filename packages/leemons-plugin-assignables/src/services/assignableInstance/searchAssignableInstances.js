const _ = require('lodash');
const dayjs = require('dayjs');
const { getDates } = require('../dates');
const { teachers, assignations, classes, assignableInstances, subjects } = require('../tables');

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

function checkIfDateIsInRange(dates, { min, max, equals, default: defaultValue }) {
  if (!dates.length) {
    return defaultValue;
  }

  return dates.some((date) => {
    if (!date) {
      return true;
    }

    if (equals) {
      return dayjs(date).isSame(dayjs(equals));
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
      const { min, max, dates, equals, default: defaultValue } = date;

      const datesToCheck = _.values(_.pick(instance.dates, dates));

      return checkIfDateIsInRange(datesToCheck, { equals, min, max, default: defaultValue });
    });

    return everyDateIsInRange;
  });

  return filteredInstances;
}

async function getInstancesDates(instances, { transacting } = {}) {
  const instancesData = await instances.reduce(async (obj, instance) => {
    const dates = await getDates('assignableInstance', instance, { transacting });

    return {
      ...(await obj),
      [instance]: {
        dates,
      },
    };
  }, {});

  return instancesData;
}

function parseDatesQuery(query) {
  const dates = ['visibility', 'deadline', 'start', 'close', 'assignment'];

  return dates
    .map((date) => {
      const datesToCheck = date === 'close' ? ['close', 'closed'] : [date];
      if (query[date]) {
        return {
          dates: datesToCheck,
          equals: query[date],
          default: false,
        };
      }
      if (query[`${date}_min`]) {
        return {
          dates: datesToCheck,
          min: query[`${date}_min`],
          default: false,
        };
      }
      if (query[`${date}_max`]) {
        return {
          dates: datesToCheck,
          max: query[`${date}_max`],
          default: false,
        };
      }

      return null;
    }, {})
    .filter(Boolean);
}

async function searchTeacherAssignableInstances(query, { userSession, transacting } = {}) {
  const userAgents = userSession.userAgents.map((userAgent) => userAgent.id);

  const results = await teachers.find({ teacher_$in: userAgents }, { transacting });

  let instances = _.map(results, 'assignableInstance');

  if (query.classes?.length) {
    const classesResults = await classes.find(
      { class_$in: query.classes, assignableInstance_$in: instances },
      { transacting }
    );

    const classesByInstance = classesResults.reduce(
      (obj, classResult) => ({
        ...obj,
        [classResult.assignableInstance]: [
          ...(obj[classResult.assignableInstance] || []),
          classResult.class,
        ],
      }),
      {}
    );

    instances = instances.filter(
      (instance) => classesByInstance[instance]?.length === query.classes.length
    );
  }

  let instancesData = await getInstancesDates(instances, { transacting });

  instancesData = _.entries(instancesData).map(([key, value]) => ({
    instance: key,
    dates: value.dates,
  }));

  const datesFilter = [
    {
      dates: ['close'],
      max: new Date(),
      default: true,
    },
    {
      dates: ['closed'],
      max: new Date(),
      default: true,
    },
    ...parseDatesQuery(query),
  ];

  const filteredResults = filterByDates(instancesData, datesFilter);

  const sortedResults = sortByGivenDates(filteredResults, [
    'close',
    'closed',
    'deadline',
    'start',
    'visibility',
  ]);

  if (query.limit) {
    sortedResults.splice(query.limit);
  }

  return _.map(sortedResults, 'instance');
}

async function searchStudentAssignableInstances(query, { userSession, transacting } = {}) {
  const userAgents = userSession.userAgents.map((userAgent) => userAgent.id);

  const studentAssignations = await assignations.find({ user_$in: userAgents }, { transacting });

  let results = studentAssignations.map((assignation) => ({
    instance: assignation.instance,
    user: assignation.user,
  }));

  let instances = _.uniq(_.map(results, 'instance'));

  if (query.subjects?.length) {
    let instancesWithAssignables = await assignableInstances.find(
      {
        id_$in: instances,
      },
      { transacting, columns: ['assignable', 'id'] }
    );

    instancesWithAssignables = instancesWithAssignables.map((instance) => ({
      assignable: instance.assignable,
      instance: instance.id,
    }));

    const assignablesToSearch = _.uniq(_.map(instancesWithAssignables, 'assignable'));

    const subjectsMatchingAssignables = await subjects.find(
      {
        assignable_$in: assignablesToSearch,
        subject_$in: query.subjects,
      },
      { transacting, columns: ['assignable', 'subject'] }
    );

    const instancesWithSubjects = instancesWithAssignables.reduce((obj, assignable) => {
      const { instance } = assignable;
      const resultingSubjects = subjectsMatchingAssignables
        .filter((subject) => subject.assignable === assignable.assignable)
        .map((s) => s.subject);

      return {
        ...obj,
        [instance]: resultingSubjects,
      };
    }, {});

    results = results.filter(
      (result) => instancesWithSubjects[result.instance]?.length === query.subjects.length
    );
    instances = _.uniq(_.map(results, 'instance'));
  }

  const instancesData = await getInstancesDates(instances, { transacting });

  results = results.map((result) => ({
    ...result,
    dates: instancesData[result.instance].dates,
  }));

  const datesFilter = [
    {
      dates: ['visibility', 'start'],
      max: new Date(),
      default: true,
    },
    ...parseDatesQuery(query),
    // TODO: Determine last day to see the task when deadline is exceeded
  ];

  const filteredResults = filterByDates(results, datesFilter);

  // TODO: CHECK ORDER
  const orderedResults = sortByGivenDates(filteredResults, ['deadline', 'start', 'visibility']);

  if (query.limit) {
    orderedResults.splice(query.limit);
  }

  return _.map(orderedResults, 'instance');
}

module.exports = async function searchAssignableInstances(
  query,
  { userSession, transacting } = {}
) {
  const teacherResults = await searchTeacherAssignableInstances(query, {
    userSession,
    transacting,
  });
  /**
   * Limit ✅
   *
   * Query:
   * Student
   *  - Task search
   *  - Subject ✅
   *  - Instance Start date ✅
   *  - Instance Deadline ✅
   *  - Scored
   * Teacher
   * - Task search
   * - Class ✅
   * - Deadine ✅
   * - Assigned date ❌
   * Common:
   *  - Task search ✅
   *  - Start date ✅
   *  - Deadline ✅
   */

  if (!teacherResults.length) {
    return searchStudentAssignableInstances(query, { userSession, transacting });
  }

  return teacherResults;
};

const _ = require('lodash');
const dayjs = require('dayjs');
const { getDates } = require('../dates');
const { teachers, assignations, classes, assignableInstances } = require('../tables');
const searchAssignables = require('../assignable/searchAssignables');

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
  const dates = ['visualization', 'deadline', 'start', 'close', 'assignment'];

  return dates
    .map((date) => {
      const datesToCheck = date === 'close' ? ['close', 'closed'] : [date];
      const defaultValue = query[`${date}_default`] === true || query[`${date}_default`] === 'true';
      if (query[date]) {
        return {
          dates: datesToCheck,
          equals: query[date],
          default: defaultValue,
        };
      }
      if (query[`${date}_min`]) {
        return {
          dates: datesToCheck,
          min: query[`${date}_min`],
          default: defaultValue,
        };
      }
      if (query[`${date}_max`]) {
        return {
          dates: datesToCheck,
          max: query[`${date}_max`],
          default: defaultValue,
        };
      }

      return null;
    }, {})
    .filter(Boolean);
}

async function filterByClasses(instances, query, { transacting } = {}) {
  if (!query.classes?.length) {
    return instances;
  }

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

  return instances.filter(
    (instance) => classesByInstance[instance]?.length === query.classes.length
  );
}

async function filterBySearchQuery(instances, query, { transacting, userSession } = {}) {
  if (!(query.search || query.subjects?.length)) {
    return instances;
  }

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

  const searchResults = await searchAssignables.call(
    this,
    undefined,
    { published: 'all', preferCurrent: false, search: query.search, subjects: query.subjects },
    { userSession, transacting }
  );

  const resultsMatchingAssignables = searchResults.filter((searchResult) =>
    assignablesToSearch.includes(searchResult)
  );

  const instancesMatchingSearch = instancesWithAssignables.filter((instance) =>
    resultsMatchingAssignables.includes(instance.assignable)
  );

  return _.map(instancesMatchingSearch, 'instance');
}

async function searchTeacherAssignableInstances(query, { userSession, transacting } = {}) {
  const userAgents = userSession.userAgents.map((userAgent) => userAgent.id);

  const results = await teachers.find({ teacher_$in: userAgents }, { transacting });

  let instances = _.map(results, 'assignableInstance');

  instances = await filterByClasses(instances, query, { transacting });

  instances = await filterBySearchQuery.call(this, instances, query, { transacting, userSession });

  let instancesData = await getInstancesDates(instances, { transacting });

  instancesData = _.entries(instancesData).map(([key, value]) => ({
    instance: key,
    dates: value.dates,
  }));

  const datesFilter = [
    // {
    //   dates: ['close'],
    //   min: new Date(),
    //   default: true,
    // },
    // {
    //   dates: ['closed'],
    //   min: new Date(),
    //   default: true,
    // },
    ...parseDatesQuery(query),
  ];

  const filteredResults = filterByDates(instancesData, datesFilter);

  const sortedResults = sortByGivenDates(filteredResults, [
    'close',
    'closed',
    'deadline',
    'start',
    'visualization',
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
  instances = await filterBySearchQuery.call(this, instances, query, { transacting, userSession });

  results = results.filter((result) => instances.includes(result.instance));

  const instancesData = await getInstancesDates(instances, { transacting });

  results = results.map((result) => ({
    ...result,
    dates: instancesData[result.instance].dates,
  }));

  const datesFilter = [
    {
      dates: ['visualization', 'start'],
      max: new Date(),
      default: true,
    },
    ...parseDatesQuery(query),
    // TODO: Determine last day to see the task when deadline is exceeded
  ];

  const filteredResults = filterByDates(results, datesFilter);

  // TODO: CHECK ORDER
  const orderedResults = sortByGivenDates(filteredResults, ['deadline', 'start', 'visualization']);

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
   * - Task search ✅
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

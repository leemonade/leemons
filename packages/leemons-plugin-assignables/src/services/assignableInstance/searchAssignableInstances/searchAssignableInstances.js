/*

❌ ✅

Filters
  Opened (open date) ✅
  Closed (close date) ✅
  Archived (archive date) ✅
  Visibility (Visibility date) ✅
  Subjects (Classes object in assignations) ✅
  Classes (Classes object in assignations) ✅
  Graded (Grades object in assignations)
  Role (Assignable roles) ✅
  Search Query: (Assignable Asset Search Query) ✅

Estudiante Sort
1º Nuevas
2º Corregidas pero no vistas su corrección
3º Terminan pronto (Siempre y cuando no hayan sido entregadas) [En el NYA nunca se ven las entregadas]
4º Fecha start
5º Fecha visibility (Si no han sido ya abiertas)

Teacher Sort
// 1º Corregidas
1º Corrección límite termina pronto
2º Fecha Cierre
2º Fecha Deadline
3º Fecha start
4º Fecha visibility

 */

const { map, uniq, uniqBy, set, flattenDeep, isNil } = require('lodash');
const dayjs = require('dayjs');
const leebrary = require('../../leebrary/leebrary');
const {
  teachers,
  assignations,
  classes,
  assignableInstances,
  grades,
  dates,
  assignables,
} = require('../../tables');

async function getActivitiesByProfile({ userSession, transacting }) {
  const userAgents = userSession.userAgents.map((userAgent) => userAgent.id);

  const assignableInstancesAsTeacher = await teachers.find(
    { teacher_$in: userAgents },
    { transacting }
  );

  if (assignableInstancesAsTeacher?.length) {
    return {
      assignableInstances: uniq(map(assignableInstancesAsTeacher, 'assignableInstance')),
      isTeacher: true,
    };
  }
  // TODO: Only get the needed properties
  const assignationsAsStudent = await assignations.find({ user_$in: userAgents }, { transacting });

  if (assignationsAsStudent?.length) {
    return {
      assignations: assignationsAsStudent,
      isTeacher: false,
    };
  }

  return {
    assignableInstances: [],
  };
}

async function filterByAssignableInstanceDates(query, assignableInstancesIds, { transacting }) {
  if (
    !(isNil(query.closed) || isNil(query.opened || isNil(query.archived)) || isNil(query.visible))
  ) {
    return assignableInstancesIds;
  }

  const assignableInstancesDates = await dates.find(
    {
      instance_$in: assignableInstancesIds,
      type: 'assignableInstance',
    },
    { transacting }
  );

  console.log('result of searching', assignableInstancesDates);
  const now = dayjs();

  const instancesWithDates = assignableInstancesDates.reduce((acc, dateObject) => {
    const { name, date, instance } = dateObject;

    return {
      ...acc,
      [instance]: {
        ...acc[instance],
        [name]: date,
      },
    };
  }, {});

  Object.entries(assignableInstancesIds).forEach(
    ([instanceId, { open, close, archive, visibility }]) => {
      console.log('checking instance', instanceId, { open, close, archive, visibility });
      if (query.closed && close && dayjs(close).isAfter(now)) {
        console.log('removing instance due to closed', instanceId);
        delete instancesWithDates[instanceId];
        return;
      }
      if (query.closed === false && close && !dayjs(close).isAfter(now)) {
        console.log('removing instance due to not closed', instanceId);
        delete instancesWithDates[instanceId];
        return;
      }

      if (query.opened && open && dayjs(open).isAfter(now)) {
        console.log('removing instance due to opened', instanceId);
        delete instancesWithDates[instanceId];
        return;
      }
      if (query.opened === false && open && !dayjs(open).isAfter(now)) {
        console.log('removing instance due to not opened', instanceId);
        delete instancesWithDates[instanceId];
        return;
      }

      if (query.archived && archive && dayjs(archive).isAfter(now)) {
        console.log('removing instance due to archived', instanceId);
        delete instancesWithDates[instanceId];
        return;
      }
      if (query.archived === false && archive && !dayjs(archive).isAfter(now)) {
        console.log('removing instance due to not archived', instanceId);
        delete instancesWithDates[instanceId];
        return;
      }

      if (query.visible && visibility && dayjs(visibility).isAfter(now)) {
        console.log('removing instance due to visible', instanceId);
        delete instancesWithDates[instanceId];
      } else if (query.visible === false && visibility && !dayjs(visibility).isAfter(now)) {
        console.log('removing instance due to not visible', instanceId);
        delete instancesWithDates[instanceId];
      }
    }
  );

  return Object.keys(instancesWithDates);
}

async function filterByClasses(query, assignableInstancesIds, { transacting, userSession }) {
  if (!(query.classes?.length || query.subjects?.length)) {
    return assignableInstancesIds;
  }
  let classesToSearch = query.classes || [];
  if (query.subjects?.length) {
    if (!classes?.length) {
      let classesFound = await classes.find(
        {
          assignableInstance_$in: assignableInstancesIds,
        },
        { transacting, columns: ['assignableInstance', 'class'] }
      );

      classesFound = uniq(map(classesFound, 'class'));

      const classesData = await leemons
        .getPlugin('academic-portfolio')
        .services.classes.classByIds(classesFound, { userSession, transacting });

      classesFound = classesFound.map((classFound) => {
        const klass = classesData.find((c) => c.id === classFound);

        return {
          id: classFound,
          subject: klass.subject.id,
        };
      });

      classesToSearch = map(
        classesFound.filter((klass) => query.subjects.includes(klass.subject)),
        'id'
      );
    }
  }

  console.log('classesToSearch', classesToSearch);

  const results = await classes.find(
    {
      class_$in: classesToSearch,
      assignableInstance_$in: assignableInstancesIds,
    },
    { transacting }
  );

  return uniq(map(results, 'assignableInstance'));
}

async function getAssignables(assignableInstancesIds, { transacting }) {
  const assignablesMatching = await assignableInstances.find(
    {
      id_$in: assignableInstancesIds,
    },
    {
      transacting,
      columns: ['assignable', 'id'],
    }
  );

  const assignablesIds = uniq(map(assignablesMatching, 'assignable'));

  const assignablesFound = await assignables.find(
    {
      id_$in: assignablesIds,
    },
    { transacting, columns: ['id', 'asset', 'role'] }
  );

  return assignablesMatching.map((instance) => ({
    ...assignablesFound.find((assignable) => assignable.id === instance.assignable),
    ...instance,
  }));
}

function filterByRole(assignablesByAssignableInstance, query) {
  if (!query.role) {
    return uniq(map(assignablesByAssignableInstance, 'assignable'));
  }

  const assignablesByAssignableInstanceWithRole = assignablesByAssignableInstance.filter(
    (assignable) => assignable.role === query.role
  );

  return uniq(map(assignablesByAssignableInstanceWithRole, 'assignable'));
}

async function searchByAsset(assignablesByAssignableInstance, query, { transacting, userSession }) {
  if (!query.search) {
    return null;
  }

  const roles = map(assignablesByAssignableInstance, 'role');

  const searchResult = await Promise.all(
    roles.map((role) =>
      leebrary().search.search(
        {
          category: `assignables.${role}`,
          criteria: query.search,
        },
        {
          allVersions: true,
          published: true,
          transacting,
          userSession,
        }
      )
    )
  );

  const matchingAssets = flattenDeep(searchResult);

  return uniq(map(matchingAssets, 'asset'));
}

module.exports = async function searchAssignableInstances(
  query,
  { userSession, transacting } = {}
) {
  const activitiesByProfile = await getActivitiesByProfile({ userSession, transacting });

  if (Array.isArray(activitiesByProfile)) {
    return activitiesByProfile;
  }

  const { isTeacher } = activitiesByProfile;
  let { assignableInstances: assignableInstancesFound, assignations: assignationsFound } =
    activitiesByProfile;

  if (!isTeacher) {
    assignableInstancesFound = uniq(map(assignationsFound, 'instance'));

    set(query, 'visible', true);
  }

  /*
    --- SEARCH ---
  */
  try {
    assignableInstancesFound = await filterByAssignableInstanceDates(
      query,
      assignableInstancesFound,
      {
        transacting,
      }
    );
    assignableInstancesFound = await filterByClasses(query, assignableInstancesFound, {
      transacting,
      userSession,
    });

    let assignablesFound = await getAssignables(assignableInstancesFound, { transacting });

    const assignablesFilteredByRole = filterByRole(assignablesFound, query);

    assignablesFound = assignablesFound.filter((assignable) =>
      assignablesFilteredByRole.includes(assignable.assignable)
    );

    const assetsMatchingQuery = await searchByAsset(assignablesFound, query, {
      transacting,
      userSession,
    });

    if (assetsMatchingQuery !== null) {
      assignablesFound = assignablesFound.filter((assignable) =>
        assetsMatchingQuery.includes(assignable.asset)
      );
    }

    assignableInstancesFound = map(assignablesFound, 'id');
    if (!isTeacher) {
      assignationsFound = assignationsFound.filter((assignation) =>
        assignableInstances.includes(assignation.instance)
      );
    }
  } catch (e) {
    throw new Error(`Failed to search activities ${e.message}`);
  }
  /*
    --- ORDER ---
  */

  if (isTeacher) {
    return assignableInstancesFound;
  }
  return map(assignationsFound, 'id');
};

// query = {
//   search: 'This is the search query',
//   opened: true,
//   archived: false,
// };

// const _ = require('lodash');
// const dayjs = require('dayjs');
// const { getDates } = require('../../dates');
// const { teachers, assignations, classes, assignableInstances, grades } = require('../../tables');
// const searchAssignables = require('../../assignable/searchAssignables');
// const filterByEvaluatedQuery = require('./filterByEvaluated');

// function sortByGivenDate(date) {
//   return (a, b) => {
//     const aDate = a[date];
//     const bDate = b[date];

//     if (!aDate && !bDate) {
//       return 0;
//     }

//     if (!aDate) {
//       return 1;
//     }
//     if (!bDate) {
//       return -1;
//     }

//     return dayjs(aDate).diff(dayjs(bDate));
//   };
// }

// function sortByGivenDates(instances, order) {
//   return instances.sort((a, b) => {
//     const { dates: aDates } = a;
//     const { dates: bDates } = b;

//     const orderLength = order.length;
//     for (let i = 0; i < orderLength; i++) {
//       const sortResult = sortByGivenDate(order[i])(aDates, bDates);

//       if (sortResult !== 0) {
//         return sortResult;
//       }
//     }

//     return 0;
//   });
// }

// function checkIfDateIsInRange(dates, { min, max, equals, default: defaultValue }) {
//   if (!dates.length) {
//     return defaultValue;
//   }

//   return dates.some((date) => {
//     if (!date) {
//       return true;
//     }

//     if (equals && dayjs(date).isSame(dayjs(equals))) {
//       return true;
//     }

//     if (!min && max) {
//       return dayjs(date).isBefore(dayjs(max));
//     }

//     if (min && !max) {
//       return dayjs(date).isAfter(dayjs(min));
//     }
//     if (min && max) {
//       return dayjs(date).isBetween(dayjs(min), dayjs(max));
//     }

//     return false;
//   });
// }

// function filterByDates(instances, datesOptions) {
//   const filteredInstances = instances.filter((instance) => {
//     const everyDateIsInRange = _.every(datesOptions, (date) => {
//       const { min, max, dates, equals, default: defaultValue } = date;

//       const datesToCheck = _.values(_.pick(instance.dates, dates));

//       return checkIfDateIsInRange(datesToCheck, { equals, min, max, default: defaultValue });
//     });

//     return everyDateIsInRange;
//   });

//   return filteredInstances;
// }

// async function getInstancesDates(instances, { transacting } = {}) {
//   const instancesData = await instances.reduce(async (obj, instance) => {
//     const dates = await getDates('assignableInstance', instance, { transacting });

//     return {
//       ...(await obj),
//       [instance]: {
//         dates,
//       },
//     };
//   }, {});

//   return instancesData;
// }

// function parseDatesQuery(query) {
//   const dates = ['visualization', 'deadline', 'start', 'close', 'assignment'];

//   return dates
//     .map((date) => {
//       const datesToCheck = date === 'close' ? ['close', 'closed'] : [date];
//       const defaultValue = query[`${date}_default`] === true || query[`${date}_default`] === 'true';
//       const dateQuery = {
//         dates: datesToCheck,
//         default: defaultValue,
//       };

//       let shouldReturn = false;
//       if (query[date]) {
//         shouldReturn = true;
//         dateQuery.equals = query[date];
//       }
//       if (query[`${date}_min`]) {
//         shouldReturn = true;
//         dateQuery.min = query[`${date}_min`];
//       }
//       if (query[`${date}_max`]) {
//         shouldReturn = true;
//         dateQuery.max = query[`${date}_max`];
//       }

//       return shouldReturn ? dateQuery : null;
//     }, {})
//     .filter(Boolean);
// }

// async function filterByClasses(instances, query, { transacting } = {}) {
//   if (!query.classes?.length) {
//     return instances;
//   }

//   const classesResults = await classes.find(
//     { class_$in: query.classes, assignableInstance_$in: instances },
//     { transacting }
//   );

//   const classesByInstance = classesResults.reduce(
//     (obj, classResult) => ({
//       ...obj,
//       [classResult.assignableInstance]: [
//         ...(obj[classResult.assignableInstance] || []),
//         classResult.class,
//       ],
//     }),
//     {}
//   );

//   return instances.filter(
//     (instance) => classesByInstance[instance]?.length === query.classes.length
//   );
// }

// async function filterBySearchQuery(instances, query, { transacting, userSession } = {}) {
//   if (!(query.search || query.subjects?.length || query.role)) {
//     return instances;
//   }

//   let instancesWithAssignables = await assignableInstances.find(
//     {
//       id_$in: instances,
//     },
//     { transacting, columns: ['assignable', 'id'] }
//   );

//   instancesWithAssignables = instancesWithAssignables.map((instance) => ({
//     assignable: instance.assignable,
//     instance: instance.id,
//   }));

//   const assignablesToSearch = _.uniq(_.map(instancesWithAssignables, 'assignable'));

//   const searchResults = await searchAssignables.call(
//     this,
//     query.role,
//     { published: 'all', preferCurrent: false, search: query.search, subjects: query.subjects },
//     { userSession, transacting }
//   );

//   const resultsMatchingAssignables = searchResults.filter((searchResult) =>
//     assignablesToSearch.includes(searchResult)
//   );

//   const instancesMatchingSearch = instancesWithAssignables.filter((instance) =>
//     resultsMatchingAssignables.includes(instance.assignable)
//   );

//   const filteredResults = instancesMatchingSearch;

//   return _.map(filteredResults, 'instance');
// }

// async function searchTeacherAssignableInstances(query, { userSession, transacting } = {}) {
//   const userAgents = userSession.userAgents.map((userAgent) => userAgent.id);

//   const results = await teachers.find({ teacher_$in: userAgents }, { transacting });

//   let instances = _.map(results, 'assignableInstance');

//   instances = await filterByClasses(instances, query, { transacting });

//   instances = await filterBySearchQuery.call(this, instances, query, { transacting, userSession });

//   let instancesData = await getInstancesDates(instances, { transacting });

//   instancesData = _.entries(instancesData).map(([key, value]) => ({
//     instance: key,
//     dates: value.dates,
//   }));

//   const datesFilter = [
//     // {
//     //   dates: ['close'],
//     //   min: new Date(),
//     //   default: true,
//     // },
//     // {
//     //   dates: ['closed'],
//     //   min: new Date(),
//     //   default: true,
//     // },
//     ...parseDatesQuery(query),
//   ];

//   let filteredResults = filterByDates(instancesData, datesFilter);
//   filteredResults = await filterByEvaluatedQuery(filteredResults, query, {
//     transacting,
//     userSession,
//   });

//   const sortedResults = sortByGivenDates(filteredResults, [
//     'close',
//     'closed',
//     'deadline',
//     'start',
//     'visualization',
//   ]);

//   if (query.limit) {
//     sortedResults.splice(query.limit);
//   }

//   return _.map(sortedResults, 'instance');
// }

// async function searchStudentAssignableInstances(query, { userSession, transacting } = {}) {
//   const userAgents = userSession.userAgents.map((userAgent) => userAgent.id);

//   const studentAssignations = await assignations.find({ user_$in: userAgents }, { transacting });

//   let results = studentAssignations.map((assignation) => ({
//     instance: assignation.instance,
//     user: assignation.user,
//   }));

//   let instances = _.uniq(_.map(results, 'instance'));
//   instances = await filterBySearchQuery.call(this, instances, query, { transacting, userSession });

//   results = results.filter((result) => instances.includes(result.instance));

//   results = await filterByEvaluatedQuery(results, query, {
//     users: userAgents,
//     transacting,
//     userSession,
//   });

//   const instancesData = await getInstancesDates(instances, { transacting });

//   results = results.map((result) => ({
//     ...result,
//     dates: instancesData[result.instance].dates,
//   }));

//   const datesFilter = [
//     {
//       dates: ['visualization', 'start'],
//       max: new Date(),
//       default: true,
//     },
//     ...parseDatesQuery(query),
//     // TODO: Determine last day to see the task when deadline is exceeded
//   ];

//   const filteredResults = filterByDates(results, datesFilter);

//   // TODO: CHECK ORDER
//   const orderedResults = sortByGivenDates(filteredResults, ['deadline', 'start', 'visualization']);

//   if (query.limit) {
//     orderedResults.splice(query.limit);
//   }

//   return _.map(orderedResults, 'instance');
// }

// module.exports = async function searchAssignableInstances(
//   query,
//   { userSession, transacting } = {}
// ) {
//   /**
//    * Limit ✅
//    *
//    * Query:
//    * Student
//    *  - Task search
//    *  - Subject ✅
//    *  - Instance Start date ✅
//    *  - Instance Deadline ✅
//    *  - Scored
//    * Teacher
//    * - Task search ✅
//    * - Class ✅
//    * - Deadine ✅
//    * - Assigned date ❌
//    * Common:
//    *  - Task search ✅
//    *  - Start date ✅
//    *  - Deadline ✅
//    *
//    *
//    * Ongoing / Closed ✅
//    * Graded / Graded x time ago
//    * Query search ✅
//    * Subject/Group ✅
//    * Status ❌
//    * Role ✅
//    */

//   const q = { ...query };

//   if (query.closed) {
//     q.close_max = new Date();
//     q.close = new Date();
//     q.close_default = false;
//   } else if (query.closed === false) {
//     q.close_min = new Date();
//     q.close_default = true;
//   }

//   if (typeof query.evaluated === 'boolean') {
//     if (query.evaluated) {
//       q.evaluated = dayjs().subtract(7, 'days');
//     } else {
//       q.evaluated = false;
//     }
//   } else {
//     const date = dayjs(query.evaluated || null);

//     if (date.isValid()) {
//       q.evaluated = date;
//     }
//   }

//   const teacherResults = await searchTeacherAssignableInstances(q, {
//     userSession,
//     transacting,
//   });

//   if (!teacherResults.length) {
//     return searchStudentAssignableInstances(q, { userSession, transacting });
//   }

//   return teacherResults;
// };

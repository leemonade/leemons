// TODO: Remove unused fields from assignations, instances, assignables and assets

const { uniq, map, difference, groupBy } = require('lodash');
const dayjs = require('dayjs');
const tables = require('../tables');

/*
  === Assets, Assignables, Instances and Assignations fetching ===
*/

async function getAssetsData(assets, { userSession, transacting }) {
  const uniqAssets = uniq(assets);

  const assetsData = await leemons.getPlugin('leebrary').services.assets.getByIds(uniqAssets, {
    withTags: false,
    withCategory: false,
    checkPins: false,
    userSession,
    showPublic: true,
    transacting,
  });

  const assetsObj = {};

  assetsData.forEach((asset) => {
    assetsObj[asset.id] = asset;
  });

  return assetsObj;
}

async function getAssignablesData(assignables, { userSession, transacting }) {
  const uniqAssignables = uniq(assignables);

  const assignablesObj = {};

  const assignablesData = await tables.assignables.find(
    {
      id_$in: uniqAssignables,
    },
    { columns: ['asset', 'id', 'role'], transacting }
  );

  const assetsIds = map(assignablesData, 'asset');
  const assetsData = await getAssetsData(assetsIds, { userSession, transacting });

  assignablesData.forEach((assignable) => {
    assignablesObj[assignable.id] = { ...assignable, asset: assetsData[assignable.asset] };
  });

  return assignablesObj;
}

async function getInstancesData(instances, { userSession, transacting }) {
  const uniqInstances = uniq(instances);

  const instancesObj = {};
  const instancesData = await tables.assignableInstances.find(
    {
      id_$in: uniqInstances,
    },
    {
      columns: ['id', 'assignable', 'alwaysAvailable', 'requiresScoring', 'allowFeedback'],
      transacting,
    }
  );

  const assignablesIds = map(instancesData, 'assignable');
  const assignablesData = await getAssignablesData(assignablesIds, { userSession, transacting });

  instancesData.forEach((instance) => {
    instancesObj[instance.id] = { ...instance, assignable: assignablesData[instance.assignable] };
  });

  return instancesObj;
}

async function getStudentAssignations({ userSession, transacting }) {
  const userAgents = userSession.userAgents.map((agent) => agent.id);
  const assignations = await tables.assignations.find(
    {
      user_$in: userAgents,
    },
    { columns: ['id', 'instance', 'user'], transacting }
  );

  const instancesIds = map(assignations, 'instance');

  const instancesData = await getInstancesData(instancesIds, { transacting });

  return assignations.map((assignation) => ({
    ...assignation,
    instance: instancesData[assignation.instance],
  }));
}

async function getTeacherInstances({ userSession, transacting }) {
  const userAgents = userSession.userAgents.map((agent) => agent.id);

  const instancesTeached = await tables.teachers.find(
    {
      teacher_$in: userAgents,
    },
    { columns: ['assignableInstance'], transacting }
  );

  return Object.values(
    await getInstancesData(map(instancesTeached, 'assignableInstance'), { transacting })
  );
}

async function getInstanceSubjectsProgramsAndClasses(instances, { userSession, transacting }) {
  const instancesIds = uniq(map(instances, 'id'));

  const instanceClasses = await tables.classes.find(
    {
      assignableInstance_$in: instancesIds,
    },
    { transacting }
  );

  const classesPerInstance = {};

  instanceClasses.forEach((instanceClass) => {
    if (classesPerInstance[instanceClass.assignableInstance]) {
      classesPerInstance[instanceClass.assignableInstance].push(instanceClass.class);
    } else {
      classesPerInstance[instanceClass.assignableInstance] = [instanceClass.class];
    }
  });

  const classesData = await leemons
    .getPlugin('academic-portfolio')
    .services.classes.classByIds(uniq(map(instanceClasses, 'class')), { userSession, transacting });

  const subjectsPerClass = {};
  const programsPerClass = {};
  classesData.forEach((klass) => {
    subjectsPerClass[klass.id] = klass.subject.id;
    programsPerClass[klass.id] = klass.program;
  });

  const dataPerInstance = {};

  instances.forEach((instance) => {
    const classes = classesPerInstance[instance.id];
    const subjects = [];
    const programs = [];
    classes.forEach((klass) => {
      subjects.push(subjectsPerClass[klass]);
      programs.push(programsPerClass[klass]);
    });

    dataPerInstance[instance.id] = {
      subjects: uniq(subjects),
      programs: uniq(programs),
      classes: classesPerInstance[instance.id],
    };
  });

  return dataPerInstance;
}

async function getDates({ instances, assignations, filters }, { transacting }) {
  const { status, progress, isArchived, sort } = filters;

  if (!(status || progress || isArchived !== undefined)) {
    return {};
  }

  const instancesIds = map(instances || [], 'id');
  const assignationsIds = map(assignations || [], 'id');

  const instanceNames = [];
  const assignationNames = [];

  if (status || progress) {
    instanceNames.push('start', 'deadline', 'closed');

    if (progress) {
      assignationNames.push('start', 'end');
    }
  }
  if (isArchived !== undefined) {
    instanceNames.push('archived');
  }

  if (['start', 'deadline'].includes(sort)) {
    instanceNames.push('start', 'deadline');
  }

  const dates = await tables.dates.find(
    {
      $or: [
        {
          type: 'assignableInstance',
          name_$in: instanceNames,
          instance_$in: instancesIds,
        },
        {
          type: 'assignation',
          name_$in: assignationNames,
          instance_$in: assignationsIds,
        },
      ],
    },
    { transacting }
  );

  const assignationDates = {};
  const instanceDates = {};

  dates.forEach((date) => {
    const typeDates = date.type === 'assignableInstance' ? instanceDates : assignationDates;

    if (typeDates[date.instance]) {
      typeDates[date.instance][date.name] = date.date;
    } else {
      typeDates[date.instance] = {
        [date.name]: date.date,
      };
    }
  });

  return {
    instances: instanceDates,
    assignations: assignationDates,
  };
}

function getInstancesStatus(instances) {
  return instances.map((instance) => {
    const datesObj = instance.dates || {};
    const now = dayjs();
    const startDate = dayjs(datesObj.start || null);
    const deadline = dayjs(datesObj.deadline || null);
    const closedDate = dayjs(datesObj.closed || null);

    const isAlwaysAvailable = instance.alwaysAvailable;

    const isStarted = isAlwaysAvailable && startDate.isValid() && !now.isBefore(startDate);
    const isDeadline = !isAlwaysAvailable && deadline.isValid() && !now.isBefore(deadline);
    const isClosed = closedDate.isValid() && !now.isBefore(closedDate);

    const isOpen = (isAlwaysAvailable || !isDeadline) && !isClosed;

    if (!isAlwaysAvailable && !isStarted) {
      return 'scheduled';
    }

    if (isOpen) {
      return 'open';
    }

    return 'closed';
  });
}

async function getAssignationsProgress({
  dates,
  assignations,
  instanceSubjectsProgramsAndClasses,
}) {
  const grades = groupBy(
    await tables.grades.find({
      assignation_$in: map(assignations, 'id'),
      type: 'main',
      visibleToStudent: true,
    }),
    'assignation'
  );

  return assignations.map((assignation) => {
    const { instance } = assignation;
    const { requiresScoring, allowFeedback, alwaysAvailable: isAlwaysAvailable } = instance;

    const isEvaluable = requiresScoring || allowFeedback;
    // TODO: Add if has any feedback when only allowFeedback
    const hasAllGrades =
      grades[assignation.id]?.length ===
      instanceSubjectsProgramsAndClasses[assignation.instance.id]?.subjects?.length;
    const hasBeenEvaluated = isEvaluable && hasAllGrades;

    const now = dayjs();
    const deadline = dayjs(dates.instances[instance.id]?.deadline || null);
    const closeDate = dayjs(dates.instances[instance.id]?.closed || null);

    const startTime = dayjs(dates.assignations[assignation.id]?.start || null);
    const endTime = dayjs(dates.assignations[assignation.id]?.end || null);

    const activityHasBeenClosed = isAlwaysAvailable
      ? closeDate.isValid() && !now.isBefore(closeDate)
      : deadline.isValid() && !now.isBefore(deadline);

    const studentHasStarted = startTime.isValid();
    const studentHasFinished = endTime.isValid();

    if (hasBeenEvaluated) {
      return 'evaluated';
    }

    if (activityHasBeenClosed && !studentHasFinished) {
      return 'notSubmitted';
    }

    if (!studentHasStarted) {
      return 'notStarted';
    }

    if (studentHasFinished) {
      return 'finished';
    }

    return 'started';
  });
}

/*
  === Helpers ===
*/
function tryParse(value) {
  try {
    return JSON.parse(value);
  } catch (e) {
    return value;
  }
}

function isNonEmptyArray(value) {
  return Array.isArray(value) && value?.length > 0;
}

/*
  === Filtering ===
*/
function filterInstancesByRoleAndQuery({ instances, filters = {} }) {
  const { query, role } = filters;

  if (!query && !role) {
    return instances;
  }

  return instances.filter(
    (instance) =>
      (query &&
        instance.assignable.asset.name.toLocaleLowerCase().includes(query.toLocaleLowerCase())) ||
      (role && instance.assignable.role === role)
  );
}

async function filterInstancesByProgramAndSubjects({
  instances,
  filters = {},
  instanceSubjectsProgramsAndClasses,
}) {
  const programs = tryParse(filters?.programs ?? null);
  const subjects = tryParse(filters?.subjects ?? null);
  const classes = tryParse(filters?.classes ?? null);

  if (!isNonEmptyArray(programs) && !isNonEmptyArray(subjects) && !isNonEmptyArray(classes)) {
    return instances;
  }

  let filteredInstances = instances;

  if (isNonEmptyArray(programs)) {
    filteredInstances = filteredInstances.filter(
      (instance) =>
        difference(programs, instanceSubjectsProgramsAndClasses[instance.id].programs)?.length === 0
    );
  }

  if (isNonEmptyArray(subjects)) {
    filteredInstances = filteredInstances.filter(
      (instance) =>
        difference(subjects, instanceSubjectsProgramsAndClasses[instance.id].subjects)?.length === 0
    );
  }

  if (isNonEmptyArray(classes)) {
    filteredInstances = filteredInstances.filter(
      (instance) =>
        difference(classes, instanceSubjectsProgramsAndClasses[instance.id].classes)?.length === 0
    );
  }

  return filteredInstances;
}

function filterAssignationsByInstance({ assignations, instances }) {
  const instancesMap = {};

  instances.forEach((instance) => {
    instancesMap[instance.id] = instance;
  });

  return assignations.filter((assignation) => !!instancesMap[assignation.instance.id]);
}

async function filterInstancesByStatusAndArchived({ instances, filters, dates }) {
  const { status: desiredStatus } = filters;

  const filterByStatus = ['open', 'closed', 'scheduled'].includes(desiredStatus);
  const filterByArchived = filters.isArchived !== undefined;

  if (!filterByArchived && !filterByStatus) {
    return instances;
  }

  const datesPerInstance = dates.instances;
  let filteredInstances = instances;

  if (filterByStatus) {
    const instancesWithDates = instances.map((instance) => ({
      id: instance.id,
      alwaysAvailable: instance.alwaysAvailable,
      dates: datesPerInstance[instance.id],
    }));
    const instancesStatus = getInstancesStatus(instancesWithDates);
    const instancesIdsToReturn = {};

    instancesStatus
      .map((status, i) => ({
        status,
        instance: instances[i],
      }))
      .filter(({ status }) => status === desiredStatus)
      .forEach((instance) => {
        instancesIdsToReturn[instance.instance] = true;
      });

    filteredInstances = filteredInstances.filter((instance) => !!instancesIdsToReturn[instance.id]);
  }

  if (filterByArchived) {
    const isArchived = [true, 'true', 1, '1'].includes(filters.isArchived);

    filteredInstances = filteredInstances.filter((instance) => {
      const now = dayjs();
      const archivedDate = dayjs(datesPerInstance[instance.id]?.archived || null);

      const instanceIsArchived = archivedDate.isValid() && !now.isBefore(archivedDate);

      return isArchived ? instanceIsArchived : !instanceIsArchived;
    });
  }

  return filteredInstances;
}

async function filterAssignationsByProgress({
  assignations,
  dates,
  filters,
  instanceSubjectsProgramsAndClasses,
}) {
  const { progress: desiredProgress } = filters;

  if (
    !['notSubmitted', 'notStarted', 'evaluated', 'finished', 'started'].includes(desiredProgress)
  ) {
    return assignations;
  }

  const assignationsProgress = await getAssignationsProgress({
    dates,
    assignations,
    instanceSubjectsProgramsAndClasses,
  });

  const progressByAssignation = {};
  assignationsProgress.forEach((progress, i) => {
    progressByAssignation[assignations[i].id] = progress;
  });

  return assignations.filter(
    (assignation) => progressByAssignation[assignation.id] === desiredProgress
  );
}

/*
  === SORTING ===
*/
function sortInstancesByDates({ instances, dates, filters }) {
  let { sort } = filters;

  if (!['assignation', 'start', 'deadline'].includes(sort)) {
    sort = 'assignation';
  }

  const instanceDates = dates.instances;

  if (sort === 'assignation') {
    return instances.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }
  if (['start', 'deadline'].includes(sort)) {
    return instances.sort((a, b) => {
      const aDate = instanceDates[a.id]?.[sort];
      const bDate = instanceDates[b.id]?.[sort];

      if (aDate && bDate) {
        return new Date(aDate) - new Date(bDate);
      }
      if (aDate && !bDate) {
        return -1;
      }
      if (bDate && !aDate) {
        return 1;
      }

      return 0;
    });
  }

  return instances;
}

function applyOffsetAndLimit(result, filters) {
  const { offset, limit } = filters;

  let items = result;
  if (offset) {
    items = items.slice(offset);
  }
  if (limit) {
    items = items.slice(0, limit);
  }

  const count = result.length;

  return {
    items,
    count: items.length,
    totalCount: count,
  };
}
/*
  === Main function ===
*/

module.exports = async function searchOngoingActivities(query, { userSession, transacting } = {}) {
  // EN: Keep in mind we are working with 2 different resources: Assignations for students and Instances for teachers.
  // ES: Ten en mente que estamos trabajando con 2 recursos: Assignations para estudiantes e Instancias para profesores.
  const isTeacher = [true, 1, 'true'].includes(query?.isTeacher);
  /*
    === TEACHER ===
  */
  if (isTeacher) {
    let instances = await getTeacherInstances({ userSession, transacting });

    instances = filterInstancesByRoleAndQuery(
      { instances, filters: query },
      { userSession, transacting }
    );

    const instanceSubjectsProgramsAndClasses = await getInstanceSubjectsProgramsAndClasses(
      instances,
      {
        userSession,
        transacting,
      }
    );

    instances = await filterInstancesByProgramAndSubjects({
      instances,
      filters: query,
      instanceSubjectsProgramsAndClasses,
    });

    const dates = await getDates({ instances, filters: query }, { transacting });

    instances = await filterInstancesByStatusAndArchived({ instances, filters: query, dates });

    return applyOffsetAndLimit(
      map(sortInstancesByDates({ instances, dates, filters: query }), 'id'),
      query
    );
  }

  /*
    === STUDENT ===
  */
  let assignations = await getStudentAssignations({ userSession, transacting });

  let instances = filterInstancesByRoleAndQuery({
    instances: map(assignations, 'instance'),
    filters: query,
  });

  const instanceSubjectsProgramsAndClasses = await getInstanceSubjectsProgramsAndClasses(
    instances,
    {
      userSession,
      transacting,
    }
  );

  instances = await filterInstancesByProgramAndSubjects({
    instances,
    filters: query,
    instanceSubjectsProgramsAndClasses,
  });

  assignations = filterAssignationsByInstance({ assignations, instances });
  const dates = await getDates({ instances, assignations, filters: query }, { transacting });

  instances = await filterInstancesByStatusAndArchived({ instances, filters: query, dates });
  assignations = filterAssignationsByInstance({ assignations, instances });

  assignations = await filterAssignationsByProgress({
    assignations,
    dates,
    filters: query,
    instanceSubjectsProgramsAndClasses,
  });

  instances = sortInstancesByDates({
    instances: map(assignations, 'instance'),
    dates,
    filters: query,
  });

  return applyOffsetAndLimit(uniq(map(instances, 'id')), query);
};

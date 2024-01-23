const { map } = require('lodash');
const { uniq } = require('lodash');
const { groupBy } = require('lodash');
const { minBy } = require('lodash');
const { maxBy } = require('lodash');

async function getModulesChildActivitiesIds({ assignations, ctx }) {
  const instancesIds = uniq(map(assignations, 'instance'));

  const instances = await ctx.tx.db.Instances.find({
    id: instancesIds,
    'metadata.module.type': 'module',
  })
    .select({
      'metadata.module': 1,
      id: 1,
      _id: 0,
    })
    .lean();

  return Object.fromEntries(
    instances.map((instance) => [instance.id, map(instance.metadata.module.activities, 'id')])
  );
}

async function getInstancesRequiresScoring({ activitiesPerInstance, ctx }) {
  const instances = await ctx.tx.db.Instances.find({
    id: Object.values(activitiesPerInstance).flat(),
  })
    .select({ requiresScoring: 1, id: 1, _id: 0 })
    .lean();

  return Object.fromEntries(instances.map((instance) => [instance.id, instance.requiresScoring]));
}

async function getChildActivitiesData({ assignations, activitiesPerInstance, ctx }) {
  const childAssignationsQuery = assignations
    .filter((assignation) => activitiesPerInstance[assignation.instance])
    .flatMap((assignation) => {
      const { instance, user } = assignation;

      return activitiesPerInstance[instance].map((activity) => ({ instance: activity, user }));
    });

  if (!childAssignationsQuery.length) return {};

  return ctx.tx.db.Assignations.find({
    $or: childAssignationsQuery,
  })
    .select({ _id: false, id: true, user: true, instance: true })
    .lean();
}

async function getDatesByChildAssignation({ childAssignationsIds, childAssignationsById, ctx }) {
  const dates = await ctx.tx.db.Dates.find({
    type: 'assignation',
    instance: childAssignationsIds,
    name: ['start', 'end'],
  })
    .select({ _id: false, instance: 1, name: 1, date: 1 })
    .lean();

  const datesByChildAssignation = new Map();

  dates.forEach((date) => {
    const { instance: assignationId, name, date: value } = date;

    const { instance, user } = childAssignationsById[assignationId][0];

    const key = `instance.${instance}.user.${user}`;
    datesByChildAssignation.set(key, { ...datesByChildAssignation.get(key), [name]: value });
  });

  return datesByChildAssignation;
}

async function getGradesByChildAssignation({ childAssignationsIds, childAssignationsById, ctx }) {
  const grades = await ctx.db.Grades.find({ assignation: childAssignationsIds, type: 'main' })
    .select({ _id: false, assignation: 1, grade: 1, subject: 1 })
    .lean();

  const gradesByChildAssignation = new Map();
  grades.forEach(({ assignation, grade, subject }) => {
    const { instance, user } = childAssignationsById[assignation][0];
    const key = `instance.${instance}.user.${user}`;
    gradesByChildAssignation.set(key, [
      ...(gradesByChildAssignation.get(key) ?? []),
      { grade, subject },
    ]);
  });

  return gradesByChildAssignation;
}

async function getSubjectsByChildAssignation({ activitiesPerInstance, ctx }) {
  const classes = await ctx.tx.db.Classes.find({
    assignableInstance: Object.values(activitiesPerInstance).flat(),
  })
    .select({ _id: false, assignableInstance: 1, class: 1 })
    .lean();

  const classesByInstance = groupBy(classes, 'assignableInstance');

  const classesIds = uniq(map(classes, 'class'));

  const classesData = await ctx.tx.call('academic-portfolio.classes.classByIds', {
    ids: classesIds,
    withProgram: false,
    withTeachers: false,
    noSearchChildren: true,
    noSearchParents: true,
  });

  const subjectsByClass = {};

  classesData.forEach((classData) => {
    const {
      subject: { id: subject },
      id,
    } = classData;

    if (!subjectsByClass[id]) {
      subjectsByClass[id] = new Set([subject]);
    } else {
      subjectsByClass[id].add(subject);
    }
  });

  const subjectsByInstance = new Map();

  Object.keys(classesByInstance).forEach((instance) => {
    const subjects = [];

    classesByInstance[instance].forEach(({ class: classId }) => {
      subjects.push(...subjectsByClass[classId]);
    });

    subjectsByInstance.set(instance, uniq(subjects));
  });

  return subjectsByInstance;
}

function returnData({
  assignationsData,
  activitiesPerInstance,
  datesByChildAssignation,
  gradesByChildAssignation,
  subjectsByChildAssignation,
  activitiesRequiresScoring,
}) {
  const datesData = {};
  const completion = {};
  const gradesData = {};
  const status = {};

  assignationsData.forEach(({ instance, user, id }) => {
    const activities = activitiesPerInstance[instance];

    if (!activities) {
      return;
    }

    /*
      === Dates ===
    */

    const dates = activities.map(
      (activity) => datesByChildAssignation.get(`instance.${activity}.user.${user}`) ?? {}
    );

    const startDate = minBy(dates, 'start')?.start ?? null;
    const endDate = dates.some((date) => !date?.end) ? null : maxBy(dates, 'end')?.end;

    const datesObj = {};

    if (startDate) {
      datesObj.start = startDate;
    }
    if (endDate) {
      datesObj.end = endDate;
    }

    datesData[id] = datesObj;

    /*
      === Grades ===
    */

    const grades = activities.flatMap(
      (activity) => gradesByChildAssignation.get(`instance.${activity}.user.${user}`) ?? []
    );

    const gradeAvg = grades.reduce((avgGrade, { grade }) => avgGrade + grade, 0) / grades.length;

    gradesData[id] = [
      {
        grade: gradeAvg,
        type: 'main',
      },
    ];

    /*
      === Completion ===
    */

    completion[id] = {
      started: dates.filter((date) => date.start).length,
      completed: dates.filter((date) => date.end).length,
      total: activities.length,
    };

    /*
      === Status ===
    */
    status[id] = activities.map((activity) => {
      const _grades = gradesByChildAssignation.get(`instance.${activity}.user.${user}`) ?? [];
      const _dates = datesByChildAssignation.get(`instance.${activity}.user.${user}`) ?? {};
      const subjects = subjectsByChildAssignation.get(activity) ?? [];
      const requiresScoring = activitiesRequiresScoring[activity] ?? false;

      return {
        instance: activity,

        started: !!_dates.start,
        completed: !!_dates.end,
        total: activities.length,

        evaluatedCount: _grades.length,
        expectedEvaluations: requiresScoring ? subjects.length : 0,
        fullyEvaluated: requiresScoring ? _grades.length === subjects.length : true,

        gradeAvg: requiresScoring
          ? _grades.reduce((avgGrade, { grade }) => avgGrade + grade, 0) / subjects.length
          : null,
      };
    });
  });

  return { dates: datesData, completion, grades: gradesData, status };
}

async function getModuleActivitiesTimestamps({ assignationsData, ctx }) {
  const assignations = assignationsData.map(({ instance, user }) => ({ instance, user }));

  const activitiesPerInstance = await getModulesChildActivitiesIds({
    assignations,
    ctx,
  });

  const activitiesRequiresScoring = await getInstancesRequiresScoring({
    activitiesPerInstance,
    ctx,
  });

  const childAssignations = await getChildActivitiesData({
    assignations,
    activitiesPerInstance,
    ctx,
  });

  const childAssignationsById = groupBy(childAssignations, 'id');
  const childAssignationsIds = map(childAssignations, 'id');

  const datesByChildAssignation = await getDatesByChildAssignation({
    childAssignationsIds,
    childAssignationsById,
    ctx,
  });

  const gradesByChildAssignation = await getGradesByChildAssignation({
    childAssignationsIds,
    childAssignationsById,
    ctx,
  });

  const subjectsByChildAssignation = await getSubjectsByChildAssignation({
    activitiesPerInstance,
    ctx,
  });

  return returnData({
    assignationsData,
    activitiesPerInstance,
    datesByChildAssignation,
    gradesByChildAssignation,
    subjectsByChildAssignation,
    activitiesRequiresScoring,
  });
}

module.exports = { getModuleActivitiesTimestamps };

const _ = require('lodash');
const dayjs = require('dayjs');
const { classes, assignations, grades } = require('../../tables');

// const instances = ['instance1', 'instance2', 'instance3'];

// const classes = {
//   find: () => [
//     {
//       assignableInstance: instances[0],
//       class: 'class0',
//     },
//     {
//       assignableInstance: instances[0],
//       class: 'class1',
//     },
//     {
//       assignableInstance: instances[0],
//       class: 'class2',
//     },
//     {
//       assignableInstance: instances[1],
//       class: 'class1',
//     },
//     {
//       assignableInstance: instances[1],
//       class: 'class2',
//     },
//   ],
// };

// const assignations = {
//   find: () => [
//     {
//       id: 'assignation1',
//       user: 'user1',
//       instance: instances[1],
//     },
//     {
//       id: 'assignation2',
//       user: 'user2',
//       instance: instances[0],
//     },
//     {
//       id: 'assignation3',
//       user: 'user1',
//       instance: instances[0],
//     },
//   ],
// };

// const grades = {
//   find: () => [
//     {
//       subject: 'subject0',
//       date: '2020-07-10 22:11',
//       assignation: assignations.find()[0].id,
//     },
//     {
//       subject: 'subject1',
//       date: '2020-07-10 22:11',
//       assignation: assignations.find()[0].id,
//     },
//     {
//       subject: 'subject02',
//       date: '2020-07-10 23:33',
//       assignation: assignations.find()[1].id,
//     },
//   ],
// };

async function subjectsPerInstance(instances, { transacting } = {}) {
  const classesFound = await classes.find(
    {
      assignableInstance_$in: instances,
    },
    { transacting, columns: ['assignableInstance', 'class'] }
  );

  // TODO: for now, 1 class = 1 subject, 2 classes have diff subjects

  const result = classesFound.reduce(
    (acc, { assignableInstance, class: c }) => ({
      ...acc,
      [assignableInstance]: [...(acc?.[assignableInstance] || []), c],
    }),
    {}
  );

  return result;
}

async function getMatchingAssignations(instances, { users, transacting } = {}) {
  const query = {
    instance_$in: instances,
  };

  if (users) {
    query.user_$in = users;
  }

  const foundAssignations = assignations.find(query, { transacting });

  return foundAssignations;
}

async function getMainGradesPerAssignation(assignations, { users, transacting } = {}) {
  const isStudent = users?.length;
  const query = {
    assignation_$in: _.map(assignations, 'id'),
    type: 'main',
  };

  if (isStudent) {
    query.visibleToStudent = true;
  }

  const gradesPerAssignation = await grades.find(query, { transacting });

  const groupedGrades = _.groupBy(gradesPerAssignation, 'assignation');

  return assignations.map((assignation) => ({
    ...assignation,
    grades: groupedGrades[assignation.id] || [],
  }));
}

function filterInstancesNotHavingAllTheStudentsEvaluated(
  assignationsWithGradesPerInstance,
  subjects
) {
  const assignationsWithGradesAndIdPerInstance = _.mapValues(
    assignationsWithGradesPerInstance,
    (value, key) => ({
      instance: key,
      assignations: value,
    })
  );

  return _.filter(assignationsWithGradesAndIdPerInstance, ({ assignations }) =>
    assignations.every((assignation) => {
      const subjectsForInstance = subjects[assignation?.instance];
      return assignation?.grades?.length >= subjectsForInstance.length;
    })
  );
}

function filterByMinDate(instancesWithAssignations, minDate) {
  return _.filter(instancesWithAssignations, ({ assignations }) =>
    assignations.some((assignation) =>
      assignation.grades.some((grade) => dayjs(grade.date).isAfter(minDate))
    )
  );
}

async function filterByEvaluated(instances, query, { users, transacting } = {}) {
  if (_.isNil(query.evaluated)) {
    return instances;
  }

  const instancesIds = _.map(instances, 'instance');
  // Necesitamos las asignaturas
  const subjects = await subjectsPerInstance(instancesIds, { transacting });

  // Tenemos las asignaciones con las que vamos a comparar
  const matchingAssignations = await getMatchingAssignations(instancesIds, {
    users,
    transacting,
  });

  // Traemos la nota por asignación
  // Necesitamos las notas main
  const gradesPerAssignation = await getMainGradesPerAssignation(matchingAssignations, {
    users,
    transacting,
  });

  const assignationsWithGradesPerInstance = _.groupBy(gradesPerAssignation, 'instance');

  let filteredInstances = filterInstancesNotHavingAllTheStudentsEvaluated(
    assignationsWithGradesPerInstance,
    subjects
  );

  if (query?.evaluated?.isValid?.()) {
    filteredInstances = filterByMinDate(filteredInstances, query?.evaluated);
  }

  const matchingIds = _.map(filteredInstances, 'instance');

  return instances.filter((instance) => matchingIds.includes(instance.instance));
  // Necesitamos la cantidad de alumnos

  // Si todas la main grade de todas las asignaturas
  // para todos los alumnos existe, entonces, está evaluada
  // Necesitamos saber también la fecha de la última evaluación
  // De una instancia
}

module.exports = filterByEvaluated;

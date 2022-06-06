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

async function subjectsPerInstance(instances, { userSession, transacting } = {}) {
  let classesFound = await classes.find(
    {
      assignableInstance_$in: instances,
    },
    { transacting, columns: ['assignableInstance', 'class'] }
  );

  const ids = _.map(classesFound, 'class');
  const classesData = await leemons
    .getPlugin('academic-portfolio')
    .services.classes.classByIds(ids, { userSession, transacting });

  classesFound = classesFound.map((classFound) => {
    const klass = classesData.find((c) => c.id === classFound.class);
    return {
      ...classFound,
      subject: klass.subject.id,
    };
  });

  // TODO: for now, 1 class = 1 subject, 2 classes have diff subjects

  const result = classesFound.reduce(
    (acc, { assignableInstance, class: c, subject }) => ({
      ...acc,
      [assignableInstance]: [...(acc?.[assignableInstance] || []), { class: c, subject }],
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
  classesWithSubjects
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
      const subjectsForInstance = _.uniq(
        classesWithSubjects[assignation?.instance]?.map((klass) => klass.subject)
      );
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

async function filterByEvaluated(instances, query, { users, transacting, userSession } = {}) {
  if (!(_.isNil(query.evaluated) || _.isNil(query.subjects) || _.isNil(query.classes))) {
    return instances;
  }

  let instancesIds = _.map(instances, 'instance');
  // Necesitamos las asignaturas
  const classesWithSubjects = await subjectsPerInstance(instancesIds, {
    userSession,
    transacting,
  });

  if (query.subjects || query.classes) {
    const classesMatchingFilters = _.mapValues(classesWithSubjects, (_classes) => {
      let matches = true;
      if (query.subjects) {
        const matchesSubjects = _classes.some((klass) => query.subjects.includes(klass.subject));

        if (!matchesSubjects) {
          matches = false;
        }
      }

      if (query.classes) {
        const matchesClasses = _classes.some((klass) => query.classes.includes(klass.class));

        if (!matchesClasses) {
          matches = false;
        }
      }

      if (matches) {
        return _classes;
      }
      return null;
    });

    let instancesMatchingClassesFilters = _.keys(classesMatchingFilters);
    instancesMatchingClassesFilters = instancesMatchingClassesFilters.filter(
      (instance) => classesMatchingFilters[instance]
    );

    instancesIds = instancesMatchingClassesFilters;
  }

  if (_.isNil(query.evaluated)) {
    return instances.filter((instance) => instancesIds.includes(instance.instance));
  }

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
    classesWithSubjects
  );

  if (query?.evaluated?.isValid?.()) {
    filteredInstances = filterByMinDate(filteredInstances, query?.evaluated);
  }

  const matchingIds = _.map(filteredInstances, 'instance');

  if (query.evaluated) {
    return instances.filter((instance) => matchingIds.includes(instance.instance));
  }
  return instances.filter(
    (instance) =>
      !matchingIds.includes(instance.instance) && instancesIds.includes(instance.instance)
  );

  // Necesitamos la cantidad de alumnos

  // Si todas la main grade de todas las asignaturas
  // para todos los alumnos existe, entonces, está evaluada
  // Necesitamos saber también la fecha de la última evaluación
  // De una instancia
}

module.exports = filterByEvaluated;

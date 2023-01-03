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
1º Nuevas ✅
2º Corregidas pero no vistas su corrección ❌
3º Terminan pronto (Siempre y cuando no hayan sido entregadas) [En el NYA nunca se ven las entregadas] ✅
4º Fecha start ✅
5º Fecha visibility (Si no han sido ya abiertas) ✅

Teacher Sort
// 1º Corregidas
1º Corrección límite termina pronto ✅
2º Fecha Cierre ✅
2º Fecha Deadline ✅
3º Fecha start ✅
4º Fecha visibility ✅

 */

const { map, uniq, set, flattenDeep, isNil, pull, take } = require('lodash');
const dayjs = require('dayjs');
const leebrary = require('../../leebrary/leebrary');
const {
  teachers,
  assignations,
  classes,
  assignableInstances,
  dates,
  assignables,
} = require('../../tables');
const getGrade = require('../../grades/getGrade');

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

async function getInstanceDates(instances, { transacting }) {
  const assignableInstancesDates = await dates.find(
    {
      instance_$in: instances,
      type: 'assignableInstance',
    },
    { transacting }
  );

  return assignableInstancesDates.reduce((acc, dateObject) => {
    const { name, date, instance } = dateObject;

    return {
      ...acc,
      [instance]: {
        ...acc[instance],
        [name]: date,
      },
    };
  }, {});
}

async function filterByAssignableInstanceDates(query, assignableInstancesIds, { transacting }) {
  if (
    !(
      isNil(query.closed) ||
      isNil(query.opened || isNil(query.archived)) ||
      isNil(query.visible) ||
      isNil(query.finished)
    )
  ) {
    return assignableInstancesIds;
  }

  const instancesWithDates = await getInstanceDates(assignableInstancesIds, { transacting });
  const instancesWithoutDates = assignableInstancesIds.filter((id) => !instancesWithDates[id]);

  const now = dayjs();

  Object.entries(instancesWithDates).forEach(
    ([instanceId, { start, closed, archived, visualization: visibility, deadline }]) => {
      if (query.deadline && (!deadline || dayjs(deadline).isAfter(now))) {
        delete instancesWithDates[instanceId];
        return;
      }
      if (query.deadline === false && deadline && !dayjs(deadline).isAfter(now)) {
        delete instancesWithDates[instanceId];
        return;
      }

      if (query.closed && (!closed || dayjs(closed).isAfter(now))) {
        delete instancesWithDates[instanceId];
        return;
      }
      if (query.closed === false && closed && !dayjs(closed).isAfter(now)) {
        delete instancesWithDates[instanceId];
        return;
      }

      if (query.opened && start && dayjs(start).isAfter(now)) {
        delete instancesWithDates[instanceId];
        return;
      }
      if (query.opened === false && start && !dayjs(start).isAfter(now)) {
        delete instancesWithDates[instanceId];
        return;
      }

      if (query.archived && (!archived || dayjs(archived).isAfter(now))) {
        delete instancesWithDates[instanceId];
        return;
      }
      if (query.archived === false && archived && !dayjs(archived).isAfter(now)) {
        delete instancesWithDates[instanceId];
        return;
      }
      if (query.finished) {
        const from = dayjs(query.finished_$gt || null)
          .set('hours', 0)
          .set('minutes', 0)
          .set('seconds', 0);
        const to = dayjs(query.finished_$lt || null)
          .set('hours', 23)
          .set('minutes', 59)
          .set('seconds', 59);

        if (from.isValid() && to.isValid()) {
          const deadlineDate = dayjs(deadline || null);
          const closeDate = dayjs(closed || null);
          if (
            (!deadlineDate.isValid() && !closeDate.isValid()) ||
            deadlineDate.isBefore(from) ||
            deadlineDate.isAfter(to) ||
            closeDate.isBefore(from) ||
            closeDate.isAfter(to)
          ) {
            delete instancesWithDates[instanceId];
            return;
          }
        }
      }

      // EN: If no visibility date is set, it is assumed that the instance is visible when started.
      // ES: Si no se establece una fecha de visibilidad, se asume que la instancia es visible cuando se inicia.
      if (
        (query.visible && visibility && dayjs(visibility).isAfter(now)) ||
        (query.visible && !visibility && start && dayjs(start).isAfter(now))
      ) {
        delete instancesWithDates[instanceId];
      } else if (
        (query.visible === false && visibility && !dayjs(visibility).isAfter(now)) ||
        (query.visible === false && start && !dayjs(start).isAfter(now))
      ) {
        delete instancesWithDates[instanceId];
      }
    }
  );

  if (query.archived === true || query.finished) {
    // EN: If an instance does not have dates, it is assumed that it is not archived not finished.
    // ES: Si una instancia no tiene fechas, se asume que no está archivada ni finalizada.
    return [...Object.keys(instancesWithDates)];
  }

  return [...Object.keys(instancesWithDates), ...instancesWithoutDates];
}

async function filterByClasses(query, assignableInstancesIds, { transacting, userSession }) {
  if (!(query.classes?.length || query.subjects?.length || query.programs?.length)) {
    return assignableInstancesIds;
  }
  let classesToSearch = query.classes || [];
  if (query.subjects?.length || query.programs?.length) {
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
          program: klass.program,
        };
      });

      classesToSearch = map(
        classesFound.filter(
          (klass) =>
            (query.subjects?.length && query.subjects.includes(klass.subject)) ||
            (query.programs?.length && query.programs.includes(klass.program))
        ),
        'id'
      );
    }
  }

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

async function getInstancesSubjects(instances, { transacting, userSession }) {
  const instancesClasses = await classes.find(
    {
      assignableInstance_$in: instances,
    },
    {
      transacting,
      columns: ['assignableInstance', 'class'],
    }
  );

  const dedupedClasses = uniq(map(instancesClasses, 'class'));

  const apClasses = await leemons
    .getPlugin('academic-portfolio')
    .services.classes.classByIds(dedupedClasses, { transacting, userSession });

  const subjectsPerClass = apClasses.reduce(
    (acc, klass) => ({
      ...acc,
      [klass.id]: klass.subject.id,
    }),
    {}
  );

  const instancesSubjects = instancesClasses.reduce(
    (acc, instance) => ({
      ...acc,
      [instance.assignableInstance]: [
        ...(acc[instance.assignableInstance] || []),
        subjectsPerClass[instance.class],
      ],
    }),
    {}
  );

  return instancesSubjects;
}

async function filterByGraded(objects, query, isTeacher, { transacting, userSession }) {
  let instances = objects;
  if (!isTeacher) {
    instances = map(objects, 'instance');
  }
  if (query.evaluated === undefined) {
    return instances;
  }

  // EN: Get the instance classes.
  // ES: Obtener las clases de la instancia.
  const instancesSubjects = await getInstancesSubjects(instances, { transacting, userSession });

  if (!isTeacher) {
    const assignationsWithGrades = await Promise.all(
      objects.map(async (assignation) => {
        const studentGrades = await getGrade(
          {
            assignation: assignation.id,
            visibleToStudent: true,
            type: 'main',
          },
          { transacting }
        );
        const gradedSubjects = uniq(map(studentGrades, 'subject'));

        return {
          ...assignation,
          grades: studentGrades,
          fullyGraded: gradedSubjects.length === instancesSubjects[assignation.instance]?.length,
        };
      })
    );

    return map(
      assignationsWithGrades.filter(({ fullyGraded }) => {
        if (query.evaluated) {
          return fullyGraded;
        }
        if (!query.evaluated) {
          return !fullyGraded;
        }

        return true;
      }),
      'instance'
    );
  }

  // EN: Get all the students assignations
  // ES: Obtener todas las asignaciones de los estudiantes.
  const studentsAssignations = await assignations.find(
    {
      instance_$in: instances,
    },
    {
      transacting,
      columns: ['instance', 'id'],
    }
  );

  // EN: Get all the students grades
  // ES: Obtener todas las calificaciones de los estudiantes.
  const studentsGrades = await Promise.all(
    studentsAssignations.map(async (assignation) => {
      const studentGrades = await getGrade(
        {
          assignation: assignation.id,
          visibleToStudent: false,
          type: 'main',
        },
        {
          transacting,
        }
      );

      return {
        ...assignation,
        grades: studentGrades,
        fullyGraded: studentGrades.length === instancesSubjects[assignation.instance]?.length,
      };
    })
  );

  // EN: Group the students grades by assignableInstance
  // ES: Agrupar las calificaciones de los estudiantes por instancia.
  const studentsGradesByAssignableInstance = studentsGrades.reduce(
    (acc, assignation) => ({
      ...acc,
      [assignation.instance]: [...(acc[assignation.instance] || []), assignation.fullyGraded],
    }),
    {}
  );

  // EN: Filter the assignations by the query.evaluated
  // ES: Filtrar las asignaciones por query.evaluated.
  return Object.entries(studentsGradesByAssignableInstance)
    .filter(([, studentsFullyGraded]) => {
      if (query.evaluated) {
        return !studentsFullyGraded.some((grade) => !grade);
      }
      return studentsFullyGraded.some((grade) => !grade);
    })
    .map(([assignableInstance]) => assignableInstance);

  // if (query.graded) {
  //   return objects.filter((object) => object.graded);
  // }

  // if (!query.graded) {
  //   return objects.filter((object) => !object.graded);
  // }
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

async function getAssignationsDates(assignations, { transacting }) {
  const datesFound = await dates.find(
    {
      type: 'assignation',
      instance_$in: assignations,
    },
    {
      transacting,
      columns: ['instance', 'name', 'date'],
    }
  );

  return datesFound.reduce((acc, date) => {
    acc[date.instance] = {
      ...acc[date.instance],
      [date.name]: date.date,
    };
    return acc;
  }, {});
}

function sortByDates(instances, datesToSort) {
  // Sort by the given dates, if they are the same, use the next one.
  const datesToSortLength = datesToSort.length;
  return instances.sort((a, b) => {
    for (let i = 0; i < datesToSortLength; i++) {
      const dateToSort = datesToSort[i];
      const aDate = a[dateToSort];
      const bDate = b[dateToSort];
      const aDateMoment = dayjs(aDate || null);
      const bDateMoment = dayjs(bDate || null);
      if (aDateMoment.isValid() && !bDateMoment.isValid()) {
        return -1;
      }
      if (!aDateMoment.isValid() && bDateMoment.isValid()) {
        return 1;
      }

      if (aDateMoment.isAfter(bDateMoment)) {
        return 1;
      }
      if (aDateMoment.isBefore(bDateMoment)) {
        return -1;
      }
    }
    return 0;
  });
}

function getInstanceGroup(instance, instances) {
  if (!instance) {
    return null;
  }

  const group = [instance];

  group.push(
    ...instance.relatedAssignableInstances?.after?.flatMap((relatedInstance) =>
      getInstanceGroup(instances[relatedInstance.id], instances)
    )
  );

  return group.filter(Boolean);
}

module.exports = async function searchAssignableInstances(
  query,
  { userSession, transacting } = {}
) {
  const activitiesByProfile = await getActivitiesByProfile({ userSession, transacting });

  const { isTeacher } = activitiesByProfile;

  let { assignableInstances: assignableInstancesFound, assignations: assignationsFound } =
    activitiesByProfile;

  if (!isTeacher) {
    if (!assignationsFound?.length) {
      return [];
    }
    assignableInstancesFound = uniq(map(assignationsFound, 'instance'));

    set(query, 'visible', true);
  } else if (!assignableInstancesFound?.length) {
    return [];
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
        assignableInstancesFound.includes(assignation.instance)
      );
    }

    assignableInstancesFound = await filterByGraded(
      isTeacher ? assignableInstancesFound : assignationsFound,
      query,
      isTeacher,
      {
        transacting,
        userSession,
      }
    );

    if (!isTeacher) {
      assignationsFound = assignationsFound.filter((assignation) =>
        assignableInstancesFound.includes(assignation.instance)
      );
    }
  } catch (e) {
    throw new Error(`Failed to search activities ${e.message}`);
  }
  /*
    --- ORDER ---
  */

  try {
    const instances = (
      await assignableInstances.find(
        {
          id_$in: assignableInstancesFound,
          $sort: 'created_at:ASC',
        },
        {
          transacting,
          columns: ['id', 'created_at', 'relatedAssignableInstances'],
        }
      )
    ).map((instance) => ({
      ...instance,
      relatedAssignableInstances: JSON.parse(instance.relatedAssignableInstances),
    }));

    let instancesObject = instances.reduce(
      (obj, instance) => ({ ...obj, [instance.id]: instance }),
      {}
    );

    if (isTeacher) {
      const instancesGroupedByDependencies = instances.reduce((groups, instance) => {
        if (
          !instance.relatedAssignableInstances?.before?.length ||
          !instance.relatedAssignableInstances?.before?.some((before) => instancesObject[before.id])
        ) {
          return [
            ...groups,
            getInstanceGroup(instancesObject[instance.id], instancesObject).reverse(),
          ];
        }

        return groups;
      }, []);

      if (!query.sortBySeverity) {
        // EN: Sort by activity dependency and assignation dates
        // ES: Filtrar por dependencia de actividad y por fechas de asignación

        const sortedInstancesGroupedByDependencies = instancesGroupedByDependencies.sort((a, b) => {
          const aMinCreationDate = a[a.length - 1].created_at;
          const bMinCreationDate = b[b.length - 1].created_at;

          return bMinCreationDate - aMinCreationDate;
        });

        const sortedInstances = sortedInstancesGroupedByDependencies.flat();

        if (query.limit) {
          return take(map(sortedInstances, 'id'), query.limit);
        }
        return map(sortedInstances, 'id');
      }

      if (query.sortBySeverity) {
        const instanceDates = await getInstanceDates(assignableInstancesFound, { transacting });

        const instancesToSort = map(assignableInstancesFound, (instance) => ({
          id: instance,
          ...instanceDates[instance],
        }));

        if (query.limit) {
          return take(
            map(
              sortByDates(instancesToSort, ['close', 'closed', 'deadline', 'start', 'visibility']),
              'id'
            ),
            query.limit
          );
        }
        return map(
          sortByDates(instancesToSort, ['close', 'closed', 'deadline', 'start', 'visibility']),
          'id'
        );
      }
    }

    if (!isTeacher) {
      if (!query.sortBySeverity) {
        const assignationDates = await getAssignationsDates(map(assignationsFound, 'id'), {
          transacting,
        });

        const instanceDates = await getInstanceDates(assignableInstancesFound, {
          transacting,
        });

        instancesObject = assignationsFound.reduce(
          (obj, { instance, ...assignation }) => ({
            ...obj,
            [instance]: {
              ...instancesObject[instance],
              dates: instanceDates[instance],
              assignation: {
                ...assignation,
                dates: assignationDates[assignation.id],
              },
            },
          }),
          {}
        );

        let assignationsGroupedByDependencies = instances.reduce((groups, instance) => {
          // EN: If its the first on the dependency tree, or the previous ones does not exists in the conext
          // ES: Si es la primera en el árbol de dependencias, o las anteriores no existen en el contexto
          if (
            !instance.relatedAssignableInstances?.before?.length ||
            !instance.relatedAssignableInstances?.before?.some(
              (before) => instancesObject[before.id]
            )
          ) {
            return [...groups, getInstanceGroup(instancesObject[instance.id], instancesObject)];
          }

          return groups;
        }, []);

        assignationsGroupedByDependencies = assignationsGroupedByDependencies.map((group) => ({
          group,
          ...group.reduce((datesObj, instance) => {
            const newDates = {};

            if (!instance.dates) {
              return datesObj;
            }

            Object.entries(instance.dates).forEach(([name, date]) => {
              if (!datesObj[name] || datesObj[name] > date) {
                newDates[name] = date;
              }
            });

            return {
              ...datesObj,
              ...newDates,
            };
          }, {}),
        }));

        const groupsSortedByDates = sortByDates(assignationsGroupedByDependencies, [
          'deadline',
          'start',
          'visualization',
        ]);

        const sortedInstances = map(map(groupsSortedByDates, 'group').flat(), 'id');

        if (query?.limit) {
          return take(sortedInstances, query.limit);
        }

        return sortedInstances;
      }

      if (query.sortBySeverity) {
        const sorted = [];

        const assignationDates = await getAssignationsDates(map(assignationsFound, 'id'), {
          transacting,
        });

        const instanceDates = await getInstanceDates(assignableInstancesFound, {
          transacting,
        });

        const assignationsByInstance = assignationsFound.reduce(
          (obj, { instance, ...assignation }) => ({
            ...obj,
            [instance]: { ...assignation, dates: assignationDates[assignation.id] },
          }),
          {}
        );

        const assignationsLeft = assignationsFound
          .filter((assignation) => {
            const instance = instancesObject[assignation.instance];

            if (!instance?.relatedAssignableInstances?.before?.length) {
              return true;
            }

            return instance?.relatedAssignableInstances.before.every(
              (relation) => assignationDates[assignationsByInstance[relation.id]?.id]?.end
            );
          })
          .map((instance) => ({
            ...instance,
            ...instanceDates[instance.instance],
          }));

        // EN: Sort new first
        // ES: Ordena primero las nuevas
        const newAssignations = assignationsLeft
          .filter((assignation) => !assignationDates[assignation.id]?.open)
          .map((assignation) => {
            pull(assignationsLeft, assignation);
            return assignation;
          });

        if (newAssignations.length > 0) {
          sorted.push(...sortByDates(newAssignations, ['deadline', 'start', 'visualization']));
        }

        // EN: Sort next the non finished but opened activities
        // ES: Ordenar después las actividades abiertas pero no terminadas
        const nonFinishedAssignations = assignationsLeft
          .filter((assignation) => {
            const openDate = instanceDates[assignation.instance]?.open;
            const endDate = assignationDates[assignation.id]?.end;

            const isOpen = !openDate || !dayjs(openDate).isBefore(dayjs());
            const isFinished = !!endDate;

            return isOpen && !isFinished;
          })
          .map((assignation) => {
            pull(assignationsLeft, assignation);
            return assignation;
          });

        if (nonFinishedAssignations.length > 0) {
          sorted.push(
            ...sortByDates(nonFinishedAssignations, ['deadline', 'start', 'visualization'])
          );
        }

        // EN: Sort non-new activities
        // ES: Ordena las actividades no nuevas
        sorted.push(...sortByDates(assignationsLeft, ['deadline', 'start', 'visualization']));

        if (query.limit) {
          return take(map(sorted, 'instance'), query.limit);
        }
        return map(sorted, 'instance');
      }
    }

    return [];
  } catch (e) {
    throw new Error(`Failed to order activities ${e.message}`);
  }
};

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

const { map, uniq, set, pull, take } = require('lodash');
const dayjs = require('dayjs');

const { LeemonsError } = require('@leemons/error');

const { getActivitiesByProfile } = require('./getActivitiesByProfile');
const { filterByInstanceDates } = require('./filterByInstanceDates');
const { filterByClasses } = require('./filterByClasses');
const { filterByRole } = require('./filterByRole');
const { filterByGraded } = require('./filterByGraded');
const { searchByAsset } = require('./searchByAsset');
const { getAssignables } = require('./getAssignables');
const { getInstanceGroup } = require('./getInstanceGroup');
const { getAssignationsDates } = require('./getAssignationsDates');
const { getInstanceDates } = require('./getInstanceDates');
const { sortByDates } = require('./sortByDates');

async function searchInstances({ query, ctx }) {
  const activitiesByProfile = await getActivitiesByProfile({ ctx });

  const { isTeacher } = activitiesByProfile;

  let {
    assignableInstances: assignableInstancesFound,
    assignations: assignationsFound,
  } = activitiesByProfile;

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
    assignableInstancesFound = await filterByInstanceDates({
      query,
      assignableInstancesIds: assignableInstancesFound,
      ctx,
    });

    assignableInstancesFound = await filterByClasses({
      query,
      assignableInstancesIds: assignableInstancesFound,
      ctx,
    });

    let assignablesFound = await getAssignables({
      assignableInstancesIds: assignableInstancesFound,
      ctx,
    });

    const assignablesFilteredByRole = filterByRole(assignablesFound, query);

    assignablesFound = assignablesFound.filter((assignable) =>
      assignablesFilteredByRole.includes(assignable.assignable)
    );

    const assetsMatchingQuery = await searchByAsset({
      assignablesByAssignableInstance: assignablesFound,
      query,
      ctx,
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

    assignableInstancesFound = await filterByGraded({
      objects: isTeacher ? assignableInstancesFound : assignationsFound,
      query,
      isTeacher,
      ctx,
    });

    if (!isTeacher) {
      assignationsFound = assignationsFound.filter((assignation) =>
        assignableInstancesFound.includes(assignation.instance)
      );
    }
  } catch (e) {
    throw new LeemonsError(ctx, {
      message: `Failed to search activities: ${e.message}`,
    });
  }
  /*
    --- ORDER ---
  */

  try {
    const instances = (
      await ctx.tx.db.Instances.find({
        id: assignableInstancesFound,
      })
        .select(['id', 'created_at', 'relatedAssignableInstances'])
        .sort({ created_at: 'asc' })
        .lean()
    ).map((instance) => ({
      ...instance,
      relatedAssignableInstances: instance.relatedAssignableInstances,
    }));

    let instancesObject = instances.reduce(
      (obj, instance) => ({ ...obj, [instance.id]: instance }),
      {}
    );
    if (isTeacher) {
      const instancesGroupedByDependencies = instances.reduce(
        (groups, instance) => {
          if (
            !instance.relatedAssignableInstances?.before?.length ||
            !instance.relatedAssignableInstances?.before?.some(
              (before) => instancesObject[before.id]
            )
          ) {
            return [
              ...groups,
              getInstanceGroup(
                instancesObject[instance.id],
                instancesObject
              ).reverse(),
            ];
          }

          return groups;
        },
        []
      );

      if (!query.sortBySeverity) {
        // EN: Sort by activity dependency and assignation dates
        // ES: Filtrar por dependencia de actividad y por fechas de asignación

        const sortedInstancesGroupedByDependencies =
          instancesGroupedByDependencies.sort((a, b) => {
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
        const instanceDates = await getInstanceDates({
          instances: assignableInstancesFound,
          ctx,
        });

        const instancesToSort = map(assignableInstancesFound, (instance) => ({
          id: instance,
          ...instanceDates[instance],
        }));

        if (query.limit) {
          return take(
            map(
              sortByDates(instancesToSort, [
                'close',
                'closed',
                'deadline',
                'start',
                'visibility',
              ]),
              'id'
            ),
            query.limit
          );
        }
        return map(
          sortByDates(instancesToSort, [
            'close',
            'closed',
            'deadline',
            'start',
            'visibility',
          ]),
          'id'
        );
      }
    }

    if (!isTeacher) {
      if (!query.sortBySeverity) {
        const assignationDates = await getAssignationsDates({
          assignations: map(assignationsFound, 'id'),
          ctx,
        });

        const instanceDates = await getInstanceDates({
          instances: assignableInstancesFound,
          ctx,
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

        let assignationsGroupedByDependencies = instances.reduce(
          (groups, instance) => {
            // EN: If its the first on the dependency tree, or the previous ones does not exists in the conext
            // ES: Si es la primera en el árbol de dependencias, o las anteriores no existen en el contexto
            if (
              !instance.relatedAssignableInstances?.before?.length ||
              !instance.relatedAssignableInstances?.before?.some(
                (before) => instancesObject[before.id]
              )
            ) {
              return [
                ...groups,
                getInstanceGroup(instancesObject[instance.id], instancesObject),
              ];
            }

            return groups;
          },
          []
        );

        assignationsGroupedByDependencies =
          assignationsGroupedByDependencies.map((group) => ({
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

        const groupsSortedByDates = sortByDates(
          assignationsGroupedByDependencies,
          ['deadline', 'start', 'visualization']
        );

        const sortedInstances = map(
          map(groupsSortedByDates, 'group').flat(),
          'id'
        );

        if (query?.limit) {
          return take(sortedInstances, query.limit);
        }

        return sortedInstances;
      }

      if (query.sortBySeverity) {
        const sorted = [];

        const assignationDates = await getAssignationsDates({
          assignations: map(assignationsFound, 'id'),
          ctx,
        });

        const instanceDates = await getInstanceDates({
          instances: assignableInstancesFound,
          ctx,
        });

        const assignationsByInstance = assignationsFound.reduce(
          (obj, { instance, ...assignation }) => ({
            ...obj,
            [instance]: {
              ...assignation,
              dates: assignationDates[assignation.id],
            },
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
              (relation) =>
                assignationDates[assignationsByInstance[relation.id]?.id]?.end
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
          sorted.push(
            ...sortByDates(newAssignations, [
              'deadline',
              'start',
              'visualization',
            ])
          );
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
            ...sortByDates(nonFinishedAssignations, [
              'deadline',
              'start',
              'visualization',
            ])
          );
        }

        // EN: Sort non-new activities
        // ES: Ordena las actividades no nuevas
        sorted.push(
          ...sortByDates(assignationsLeft, [
            'deadline',
            'start',
            'visualization',
          ])
        );

        if (query.limit) {
          return take(map(sorted, 'instance'), query.limit);
        }
        return map(sorted, 'instance');
      }
    }

    return [];
  } catch (e) {
    throw new LeemonsError(ctx, {
      message: `Failed to search activities: ${e.message}`,
    });
  }
}

module.exports = { searchInstances };

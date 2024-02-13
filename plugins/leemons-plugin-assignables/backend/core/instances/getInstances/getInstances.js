const { map } = require('lodash');

const { LeemonsError } = require('@leemons/error');

const { listInstanceClasses } = require('../../classes/listInstanceClasses');
const { getUserPermissions } = require('../../permissions/instances/users/getUserPermissions');
const { getAssignables } = require('../../assignables/getAssignables');

const { getRelatedInstances } = require('./getRelatedInstances');
const { findDates } = require('./findDates');
const { getAssignationsData } = require('./getAssignationsData');
const { getInstancesSubjects } = require('./getInstancesSubjects');
const { getActivityEvaluationType } = require('../../helpers/getActivityEvaluationType');

/**
 * @async
 * @function getInstances
 * @param {Object} params - Parameters for getInstances
 * @param {Array<string>} params.ids - The ids of the instances
 * @param {boolean} params.relatedAssignableInstances - If the related assignable instances should be retrieved
 * @param {boolean} params.details - If the details of the instances should be retrieved
 * @param {boolean} params.throwOnMissing - If an error should be thrown when an instance is missing
 * @param {MoleculerContext} params.ctx - The Moleculer context.
 * @returns {Promise<AssignablesInstance>} The instances data
 * @throws {LeemonsError} When there is an error retrieving the instances data
 */

async function getInstances({
  ids,
  relatedAssignableInstances,
  details,
  throwOnMissing = true,
  ctx,
}) {
  let instancesIds = ids;
  const instancesTeached = {};

  const permissions = await getUserPermissions({ instancesIds: ids, ctx });

  // EN: Throw if missing permissions, or discard the missing instances
  // ES: Lanza un error si faltan permisos, o descarta esas instancias
  if (
    throwOnMissing &&
    !Object.values(permissions).every((permission) => permission.actions.includes('view'))
  ) {
    throw new LeemonsError(ctx, {
      message:
        "You don't have permissions to see some of the requested Instances or they do not exist",
    });
  } else {
    const missingInstances = {};
    Object.entries(permissions).forEach(([instance, permission]) => {
      if (!permission.actions.includes('view')) {
        missingInstances[instance] = true;
      }

      instancesTeached[instance] = permission.actions.includes('edit');
    });

    if (Object.keys(missingInstances).length) {
      instancesIds = instancesIds.filter((id) => !missingInstances[id]);
    }
  }

  // EN: Find the instances
  // ES: Busca las instancias
  const instancesData = await ctx.tx.db.Instances.find({ id: instancesIds }).lean();

  const promises = [];

  // EN: Get the related instances data
  // ES: Obtener los datos de las instancias relacionadas
  if (relatedAssignableInstances) {
    promises.push(getRelatedInstances({ instances: instancesData, details, ctx }));
  } else {
    promises.push(undefined);
  }

  let classes;
  if (details) {
    // EN: Get classes
    // ES: Obtener las clases
    classes = await listInstanceClasses({ id: instancesIds, ctx });

    // EN: Get dates
    // ES: Obtener las fechas
    promises.push(findDates({ instances: instancesIds, ctx }));

    // EN: Get the instances' assignables
    // ES: Obtener los assignables de las instances
    const assignablesIds = map(instancesData, 'assignable');
    promises.push(
      getAssignables({ ids: assignablesIds, ctx }).then((assignables) => {
        const assignablesById = {};
        assignables.forEach((assignable) => {
          assignablesById[assignable.id] = assignable;
        });
        return assignablesById;
      })
    );

    // EN: Get the assignations data
    // ES: Obtener los datos de las assignations
    promises.push(getAssignationsData({ instances: instancesIds, instancesTeached, ctx }));

    promises.push(getInstancesSubjects({ classesPerInstance: classes, ctx }));
  }

  const [relatedInstances, instancesDates, assignables, assignations, subjects] = await Promise.all(
    promises
  );

  return instancesData.map((instance) => {
    const isTeacher = instancesTeached[instance.id];

    const instanceData = {
      ...instance,
      curriculum: instance.curriculum,
      metadata: instance.metadata,
      relatedAssignableInstances: instance.relatedAssignableInstances,
      type: getActivityEvaluationType(instance),
    };

    // EN: Hide custom group name to students (if checked)
    // ES: Ocultar nombre de grupo personalizado a los estudiantes (si seleccionado)

    if (!isTeacher && instanceData.metadata && !instanceData.metadata?.showGroupNameToStudents) {
      instanceData.metadata.groupName = undefined;
      instanceData.metadata.showGroupNameToStudents = undefined;
    }

    if (details) {
      instanceData.classes = classes[instance.id] || [];
      instanceData.dates = instancesDates[instance.id] || {};
      instanceData.assignable = assignables[instance.assignable];
      instanceData.subjects = subjects[instance.id] || [];
    }

    if (isTeacher && details) {
      instanceData.students = assignations[instance.id];
    }

    if (relatedAssignableInstances) {
      instanceData.relatedAssignableInstances = relatedInstances[instance.id];
    }

    return instanceData;
  });
}

module.exports = { getInstances };

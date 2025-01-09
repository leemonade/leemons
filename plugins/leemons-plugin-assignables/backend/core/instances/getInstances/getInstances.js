const { LeemonsError } = require('@leemons/error');
const { map, difference } = require('lodash');

const { getInstanceKeyBuilder } = require('../../../cache/keys/instances');
const ttl = require('../../../cache/ttl');
const { getAssignables } = require('../../assignables/getAssignables');
const { listInstanceClasses } = require('../../classes/listInstanceClasses');
const { getActivityEvaluationType } = require('../../helpers/getActivityEvaluationType');
const { getUserPermissions } = require('../../permissions/instances/users/getUserPermissions');

const { findDates } = require('./findDates');
const { getAssignationsData } = require('./getAssignationsData');
const { getInstancesSubjects } = require('./getInstancesSubjects');
const { getRelatedInstances } = require('./getRelatedInstances');

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
    // ! This option will be deprecated
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

  const [relatedInstances, instancesDates, assignables, assignations, subjects] =
    await Promise.all(promises);

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

    // TODO: This should be done after the caching
    if (isTeacher && details) {
      instanceData.students = assignations[instance.id];
    }

    if (relatedAssignableInstances) {
      instanceData.relatedAssignableInstances = relatedInstances[instance.id];
    }

    return instanceData;
  });
}

async function getInstancesWithCache({
  ids,
  relatedAssignableInstances = false,
  details = false,
  throwOnMissing = true,
  ctx,
}) {
  if (relatedAssignableInstances) {
    console.warn('relatedAssignableInstances option is deprecated');
  }

  if (!ids?.length) {
    return [];
  }

  const getInstancesCacheKeyBuilder = getInstanceKeyBuilder({
    options: { relatedAssignableInstances, details, throwOnMissing },
    ctx,
  });

  const cacheKeys = ids.map(getInstancesCacheKeyBuilder);
  const cachedInstances = await ctx.cache.getMany(cacheKeys).then((r) => Object.values(r));

  const instancesById = {};
  const foundIds = [];

  cachedInstances.forEach((instance) => {
    instancesById[instance.id] = instance;
    foundIds.push(instance.id);
  });

  const missingIds = difference(ids, foundIds);

  if (missingIds.length) {
    const instances = await getInstances({
      ids: missingIds,
      relatedAssignableInstances,
      details,
      throwOnMissing,
      ctx,
    });

    const keysToSave = instances.map((instance) => {
      instancesById[instance.id] = instance;

      return {
        key: getInstancesCacheKeyBuilder(instance.id),
        val: instance,
        ttl: ttl.instances.get,
      };
    });

    await ctx.cache.setMany(keysToSave);
  }

  return ids.map((id) => instancesById[id]);
}

module.exports = { getInstances: getInstancesWithCache };

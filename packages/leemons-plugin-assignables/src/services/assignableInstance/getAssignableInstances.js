const { set, map, difference, uniq, flatten } = require('lodash');
const listAssignableInstanceClasses = require('../classes/listAssignableInstanceClasses');
const getUserPermissions = require('./permissions/assignableInstance/users/getUserPermissions');
const tables = require('../tables');
const getAssignables = require('../assignable/getAssignables');

// EN: Needs to be up here to allow getAssignations to use it
// ES: Necesitamos usarlo aquí para que getAssignations lo pueda usar
// eslint-disable-next-line no-use-before-define
module.exports = getAssignableInstances;
const getAssignationsOfAssignableInstance = require('../assignations/getAssignationsOfAssignableInstance');

async function findDates(instances, { transacting }) {
  const datesFound = await tables.dates.find(
    { type: 'assignableInstance', instance_$in: instances },
    { transacting, columns: ['instance', 'name', 'date'] }
  );

  const datesPerInstance = {};

  datesFound.forEach((date) => {
    const { instance, name: key, date: value } = date;
    set(datesPerInstance, `${instance}.${key}`, value);
  });

  return datesPerInstance;
}

async function getRelatedInstances(instances, { details, userSession, transacting }) {
  const relatedInstancesIds = instances.flatMap((instance) => {
    const { before, after } = JSON.parse(instance.relatedAssignableInstances);

    const ids = [];
    if (before?.length) {
      ids.push(...map(before, 'id'));
    }

    if (after?.length) {
      ids.push(...map(after, 'id'));
    }

    return ids;
  });

  const instancesIds = map(instances, 'id');
  const newInstancesIds = difference(relatedInstancesIds, instancesIds);

  let newInstancesData = [];

  if (newInstancesIds.length) {
    // eslint-disable-next-line no-use-before-define
    newInstancesData = await getAssignableInstances(newInstancesIds, {
      relatedAssignableInstances: false,
      details,
      userSession,
      transacting,
    });
  }

  const instancesByIds = {};
  instances.concat(newInstancesData).forEach((instance) => {
    instancesByIds[instance.id] = instance;
  });

  const relatedInstanceById = {};
  instances.forEach((instance) => {
    const relatedInstances = JSON.parse(instance.relatedAssignableInstances);
    relatedInstanceById[instance.id] = {
      before: relatedInstances?.before?.map((relatedInstance) => ({
        ...relatedInstance,
        instance: instancesByIds[relatedInstance.id],
      })),
      after: relatedInstances?.after?.map((relatedInstance) => ({
        ...relatedInstance,
        instance: instancesByIds[relatedInstance.id],
      })),
    };
  });

  return relatedInstanceById;
}

async function getAssignationsData(instances, { instancesTeached, userSession, transacting }) {
  const ids = instances.filter((instance) => instancesTeached[instance]);

  const studentsPerInstance = await getAssignationsOfAssignableInstance(ids, {
    details: true,
    userSession,
    transacting,
  });

  return studentsPerInstance;
}

async function getInstancesSubjects(classesPerInstance, { userSession, transacting }) {
  const instances = Object.keys(classesPerInstance);
  const classes = uniq(flatten(Object.values(classesPerInstance)));
  const academicPortfolioServices = leemons.getPlugin('academic-portfolio').services.classes;

  const classesData = await academicPortfolioServices.classByIds(classes, {
    withProgram: false,
    withTeachers: false,
    noSearchChilds: true,
    noSearchParents: true,
    userSession,
    transacting,
  });

  const subjectPerClass = {};

  classesData.forEach((klass) => {
    subjectPerClass[klass.id] = { program: klass.program, subject: klass.subject.id };
  });

  const subjectsPerInstance = {};

  instances.forEach((instance) => {
    const instanceClasses = classesPerInstance[instance];

    const subjects = [];

    instanceClasses.forEach((klass) => {
      subjects.push(subjectPerClass[klass]);
    });

    subjectsPerInstance[instance] = uniq(subjects);
  });

  return subjectsPerInstance;
}

async function getAssignableInstances(
  ids,
  { relatedAssignableInstances, details, throwOnMissing = true, userSession, transacting } = {}
) {
  let instancesIds = ids;
  const instancesTeached = {};

  const permissions = await getUserPermissions(ids, { userSession, transacting });

  // EN: Throw if missing permissions, or discard the missing instances
  // ES: Lanza un error si faltan permisos, o descarta esas instancias
  if (
    throwOnMissing &&
    !Object.values(permissions).every((permission) => permission.actions.includes('view'))
  ) {
    throw new Error(
      "You don't have permissions to see some of the requested assignableInstances or they do not exist"
    );
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
  const instancesData = await tables.assignableInstances.find({ id_$in: instancesIds });

  const promises = [];

  // EN: Get the related instances data
  // ES: Obtener los datos de las instancias relacionadas
  if (relatedAssignableInstances) {
    promises.push(getRelatedInstances(instancesData, { details, userSession, transacting }));
  } else {
    promises.push(undefined);
  }

  let classes;
  if (details) {
    // EN: Get classes
    // ES: Obtener las clases
    classes = await listAssignableInstanceClasses(instancesIds, { transacting });

    // EN: Get dates
    // ES: Obtener las fechas
    promises.push(findDates(instancesIds, { transacting }));

    // EN: Get the instances' assignables
    // ES: Obtener los assignables de las instances
    const assignablesIds = map(instancesData, 'assignable');
    promises.push(
      getAssignables(assignablesIds, { userSession, transacting }).then((assignables) => {
        const assignablesById = {};
        assignables.forEach((assignable) => {
          assignablesById[assignable.id] = assignable;
        });
        return assignablesById;
      })
    );

    // EN: Get the assignations data
    // ES: Obtener los datos de las assignations
    promises.push(
      getAssignationsData(instancesIds, { instancesTeached, userSession, transacting })
    );

    promises.push(getInstancesSubjects(classes, { userSession, transacting }));
  }

  const [relatedInstances, instancesDates, assignables, assignations, subjects] = await Promise.all(
    promises
  );

  return instancesData.map((instance) => {
    const isTeacher = instancesTeached[instance.id];

    const instanceData = {
      ...instance,
      curriculum: JSON.parse(instance.curriculum),
      metadata: JSON.parse(instance.metadata),
      relatedAssignableInstances: JSON.parse(instance.relatedAssignableInstances),
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

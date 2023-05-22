const dayjs = require('dayjs');
const { map, uniq, set, groupBy } = require('lodash');
const tables = require('../tables');
const getUserPermissions = require('../assignableInstance/permissions/assignableInstance/users/getUserPermissions');

// EN: Needs to be up here to allow getInstances to use it
// ES: Necesitamos usarlo aquí para que getInstances lo pueda usar
// eslint-disable-next-line no-use-before-define
module.exports = getAssignations;

const getAssignableInstances = require('../assignableInstance/getAssignableInstances');

async function checkPermissions(assignationsData, { userSession, transacting }) {
  const ownAssignations = {};
  const othersAssignations = [];
  const othersAssignationInstanceIds = [];
  const assignationsById = {};

  const userAgents = map(userSession.userAgents, 'id');
  assignationsData.forEach((assignation) => {
    if (userAgents.includes(assignation.user)) {
      ownAssignations[assignation.id] = true;
    } else {
      othersAssignations.push(assignation.id);
      othersAssignationInstanceIds.push(assignation.instance);
    }

    assignationsById[assignation.id] = assignation;
  });

  let instancePermissions = {};
  if (othersAssignationInstanceIds?.length) {
    instancePermissions = await getUserPermissions(othersAssignationInstanceIds, {
      userSession,
      transacting,
    });
  }

  return Object.fromEntries(
    assignationsData.map((assignation) => {
      let hasPermissions = false;
      if (ownAssignations[assignation.id]) {
        hasPermissions = true;
      } else if (instancePermissions[assignation.instance].actions.includes('edit')) {
        hasPermissions = true;
      }

      return [assignation.id, hasPermissions];
    })
  );
}

async function getClassesWithSubject(instancesIds, { userSession, transacting }) {
  const classesFound = await tables.classes.find(
    { assignableInstance_$in: instancesIds },
    { columns: ['assignableInstance', 'class'], transacting }
  );

  const classesIds = uniq(map(classesFound, 'class'));

  const apClassesServices = leemons.getPlugin('academic-portfolio').services.classes;

  const classesInfo = await apClassesServices.classByIds(classesIds, { userSession, transacting });

  const subjectsPerClass = {};
  classesInfo.forEach((klass) => {
    subjectsPerClass[klass.id] = klass.subject.id;
  });

  const classesPerInstance = {};
  classesFound.forEach(({ class: klass, assignableInstance: instance }) => {
    const klassObject = {
      id: klass,
      subject: subjectsPerClass[klass],
    };

    if (!classesPerInstance[instance]) {
      classesPerInstance[instance] = {
        classes: [klassObject],
        classesIds: [klassObject.id],
        subjectsIds: [klassObject.subject],
      };
    } else {
      classesPerInstance[instance].classes.push(klassObject);
      classesPerInstance[instance].classesIds.push(klassObject.id);
      classesPerInstance[instance].subjectsIds.push(klassObject.subject);
    }
  });

  return classesPerInstance;
}

async function getRelatedAssignations(assignationsData, { transacting }) {
  const assignationsPerInstance = {};
  const assignationsById = {};

  // EN: Define the relations between assignation and instances
  // ES: Definir relaciones entre asignaciones e instancias
  assignationsData.forEach((assignation) => {
    const { id, instance } = assignation;

    assignationsById[id] = assignation;

    if (!assignationsPerInstance[instance]) {
      assignationsPerInstance[instance] = [id];
    } else {
      assignationsPerInstance[instance] = id;
    }
  });

  // EN: Get the related-instances
  // ES: Obtener las instancias relacionadas
  const instances = Object.keys(assignationsPerInstance);

  const relatedInstances = await tables.assignableInstances.find(
    {
      id_$in: instances,
    },
    { columns: ['id', 'relatedAssignableInstances'], transacting }
  );

  const relatedInstancesByInstance = {};
  relatedInstances.forEach(({ id, relatedAssignableInstances }) => {
    const { before } = JSON.parse(relatedAssignableInstances);

    relatedInstancesByInstance[id] = before;
  });

  const relatedInstancesByAssignation = {};
  const assignationsByRelation = {};
  const assignationsToSearch = [];
  Object.entries(assignationsPerInstance).forEach(([instance, instanceAssignations]) => {
    const instancesRelated = relatedInstancesByInstance[instance];

    instanceAssignations?.forEach?.((assignation) => {
      const { user } = assignationsById[assignation];
      instancesRelated.forEach(({ id: instanceId, ...props }) => {
        if (!assignationsByRelation[`instance.${instanceId}.user.${user}`]) {
          assignationsByRelation[`instance.${instanceId}.user.${user}`] = [
            { ...props, assignation },
          ];
        } else {
          assignationsByRelation[`instance.${instanceId}.user.${user}`].push({
            ...props,
            assignation,
          });
        }

        assignationsToSearch.push({ instance: instanceId, user });
      });

      relatedInstancesByAssignation[assignation] = instancesRelated;
    });
  });

  const relatedAssignations = await tables.assignations.find(
    {
      $or: assignationsToSearch,
    },
    { columns: ['id', 'instance', 'user'], transacting }
  );

  const relatedAssignationsByAssignation = {};

  relatedAssignations.forEach(({ instance, user, id }) => {
    const key = `instance.${instance}.user.${user}`;

    const assignationsWithRelation = assignationsByRelation[key];

    if (!assignationsWithRelation?.length) {
      return;
    }

    assignationsWithRelation.forEach(({ assignation, ...props }) => {
      if (!relatedAssignationsByAssignation[assignation]) {
        relatedAssignationsByAssignation[assignation] = [{ ...props, id }];
      } else {
        relatedAssignationsByAssignation[assignation].push({ ...props, id });
      }
    });
  });

  return relatedAssignationsByAssignation;
}

async function findInstanceDates(instances, { transacting }) {
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

async function findAssignationDates(assignationsIds, { transacting }) {
  const datesFound = await tables.dates.find(
    { type: 'assignation', instance_$in: assignationsIds },
    { transacting, columns: ['instance', 'name', 'date'] }
  );

  const datesPerAssignation = {};

  datesFound.forEach((date) => {
    const { instance, name: key, date: value } = date;
    set(datesPerAssignation, `${instance}.${key}`, value);
  });

  return datesPerAssignation;
}

async function getRelatedAssignationsTimestamps(assignationsData, { transacting }) {
  const relatedAssignationsByAssignation = await getRelatedAssignations(assignationsData, {
    transacting,
  });

  const relatedAssignationsIds = map(Object.values(relatedAssignationsByAssignation).flat(), 'id');

  const datesPerAssignation = await findAssignationDates(relatedAssignationsIds, { transacting });

  Object.entries(relatedAssignationsByAssignation).forEach(([key, relatedAssignations]) => {
    relatedAssignations.forEach((assignation, i) => {
      relatedAssignationsByAssignation[key][i] = {
        ...relatedAssignationsByAssignation[key][i],
        timestamps: datesPerAssignation[assignation.id] || {},
      };
    });
  });

  return relatedAssignationsByAssignation;
}

async function getGrades(assignationsData, { userSession, transacting }) {
  const orQuery = [];

  assignationsData.forEach(({ user, id }) => {
    const isStudent = userSession.userAgents.includes(user);

    const query = { assignation: id };
    if (isStudent) {
      query.visibleToStudent = true;
    }

    orQuery.push(query);
  });

  const gradesFound = await tables.grades.find({ $or: orQuery }, { transacting });

  return groupBy(gradesFound, 'assignation');
}

function getAssignationStatus({ dates, timestamps }) {
  let finished = false;
  let started = false;

  const today = dayjs();
  const startDate = dayjs(dates.start || null);
  const deadline = dayjs(dates.deadline || null);
  const closeDate = dayjs(dates.close || null);
  const closedDate = dayjs(dates.closed || null);

  if (
    timestamps.end ||
    (deadline.isValid() && !deadline.isAfter(today)) ||
    (closeDate.isValid() && !closeDate.isAfter(today)) ||
    (closedDate.isValid() && !closedDate.isAfter(today))
  ) {
    finished = true;
  } else {
    finished = false;
  }

  if ((startDate.isValid() && !startDate.isAfter(today)) || !startDate.isValid()) {
    started = true;
  } else {
    started = false;
  }

  return {
    finished,
    started,
  };
}

async function getAssignations(
  assignationsIds,
  { throwOnMissing = true, details = true, fetchInstance, userSession, transacting } = {}
) {
  // EN: Get the assignations data
  // ES: Obtener los datos de las asignaciones
  const orQueries = [];

  let ids = [];
  assignationsIds.forEach(({ instance, user, id }) => {
    if (id) {
      ids.push(id);
    } else if (instance && user) {
      orQueries.push({ instance, user });
    }
  });

  let assignationsData = await tables.assignations.find(
    { $or: [{ id_$in: ids }, ...orQueries] },
    { transacting }
  );

  // EN: Check if the user has permissions
  // ES: Comprobar si el usuario tiene permisos
  const permissions = await checkPermissions(assignationsData, { userSession, transacting });

  if (throwOnMissing) {
    if (Object.values(permissions).some((permission) => !permission)) {
      throw new Error(
        "You don't have permissions to see some of the requested assignations or they do not exist"
      );
    }
  } else {
    assignationsData = assignationsData.filter((assignation) => permissions[assignation.id]);

    Object.values(permissions).filter((permission) => permission);
  }

  const instancesIds = map(assignationsData, 'instance');
  ids = map(assignationsData, 'id');

  if (!details) {
    return assignationsData.map((assignation) => ({
      ...assignation,
      classes: JSON.parse(assignation.classes),
      metadata: JSON.parse(assignation.metadata),
    }));
  }

  const promises = [];

  promises.push(getClassesWithSubject(instancesIds, { userSession, transacting }));

  promises.push(getRelatedAssignationsTimestamps(assignationsData, { transacting }));

  promises.push(findAssignationDates(ids, { transacting }));
  promises.push(findInstanceDates(instancesIds, { transacting }));

  promises.push(getGrades(assignationsData, { userSession, transacting }));

  if (fetchInstance) {
    promises.push(
      getAssignableInstances(instancesIds, { details: true, userSession, transacting }).then(
        (instances) => {
          const instancesByIds = {};

          instances.forEach((instance) => {
            instancesByIds[instance.id] = instance;
          });

          return instancesByIds;
        }
      )
    );
  }

  const [classes, relatedAssignations, timestamps, dates, grades, instances] = await Promise.all(
    promises
  );

  return assignationsData.map((assignation) => {
    const chatKeys = classes[assignation.instance].subjectsIds.map(
      (subject) =>
        `plugins.assignables.subject|${subject}.assignation|${assignation.id}.userAgent|${assignation.user}`
    );

    const status = getAssignationStatus({
      dates: dates[assignation.instance] || {},
      timestamps: timestamps[assignation.id] || {},
    });

    const assignationObject = {
      ...assignation,
      classes: JSON.parse(assignation.classes),
      metadata: JSON.parse(assignation.metadata),
      instance: instances?.[assignation.instance] || assignation.instance,

      relatedAssignableInstances: {
        before: relatedAssignations[assignation.id] || [],
      },
      grades: grades[assignation.id] || [],
      timestamps: timestamps[assignation.id] || {},

      chatKeys,

      ...status,
    };

    return assignationObject;
  });
}

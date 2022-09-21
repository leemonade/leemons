/* eslint-disable no-param-reassign */
const _ = require('lodash');
const dayjs = require('dayjs');
const { table } = require('../tables');
const { getPermissionConfig: getPermissionConfigCalendar } = require('./getPermissionConfig');
const { getPermissionConfig: getPermissionConfigEvent } = require('../events/getPermissionConfig');
const { getByCenterId } = require('../calendar-configs');
const { getCalendars } = require('../calendar-configs/getCalendars');
const { getEvents } = require('./getEvents');

function hasGrades(studentData) {
  const grades = studentData?.grades;

  if (!grades || !grades.length) {
    return false;
  }

  return grades.some((grade) => grade.type === 'main' && grade.visibleToStudent);
}

function getStatus(studentData, instanceData) {
  // EN: This values are keys for the localization object prefixPN('activity_status')
  // ES: Estos valores son claves para el objeto de traducción prefixPN('activity_status')

  if (studentData.finished) {
    if (hasGrades(studentData)) {
      return 'evaluated';
    }

    const deadline = dayjs(instanceData.dates.deadline || null);
    const endDate = dayjs(studentData?.timestamps?.end || null);

    const endDateIsLate = endDate.isValid() && endDate.isAfter(deadline);

    if (endDateIsLate) {
      return 'late';
    }

    if (endDate.isValid()) {
      return 'submitted';
    }

    return 'closed';
  }

  if (studentData.started) {
    const startDate = dayjs(studentData?.timestamps?.start || null);

    if (startDate.isValid()) {
      return 'started';
    }
    return 'opened';
  }

  return 'assigned';
}

/**
 * Add calendar with the provided key if not already exists
 * @public
 * @static
 * @param {any} userSession - key
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function getCalendarsToFrontend(userSession, { transacting } = {}) {
  const permissionConfigCalendar = getPermissionConfigCalendar();
  const permissionConfigEvent = getPermissionConfigEvent();
  const userPlugin = leemons.getPlugin('users');

  // ES: Cogemos todos los permisos del usuario
  // EN: We take all the user permissions
  const [userPermissions, center] = await Promise.all([
    userPlugin.services.permissions.getUserAgentPermissions(userSession.userAgents, {
      transacting,
    }),
    userPlugin.services.users.getUserAgentCenter(userSession.userAgents[0], { transacting }),
  ]);

  const queryPermissions = [];
  const ownerPermissions = [];

  // ES: Preparación de la consulta para comprobar los permisos
  // EN: Preparation of the query to check permissions
  if (userPermissions.length) {
    _.forEach(userPermissions, (userPermission) => {
      queryPermissions.push({
        permissionName: userPermission.permissionName,
        actionName_$in: userPermission.actionNames,
        target: userPermission.target,
      });
      if (userPermission.actionNames.indexOf('owner') >= 0) {
        ownerPermissions.push({
          permissionName: userPermission.permissionName,
          actionName_$in: ['owner'],
          target: userPermission.target,
        });
      }
    });
  }

  // ES: Calendarios/Eventos a los que tiene acceso de lectura
  // EN: Calendars/Events with view access
  let promises = [
    userPlugin.services.permissions.findItems(
      {
        $or: queryPermissions,
        type_$in: [permissionConfigCalendar.type, permissionConfigEvent.type],
      },
      {
        transacting,
      }
    ),
    userPlugin.services.permissions.findItems(
      {
        $or: ownerPermissions,
        type_$in: [permissionConfigCalendar.type],
      },
      {
        transacting,
      }
    ),
  ];
  if (center) promises.push(getByCenterId(center.id, { transacting }));
  const [items, ownerItems, calendarConfig] = await Promise.all(promises);

  // ES: Separamos los calendarios de los eventos
  // EN: We separate the calendars from the events
  const calendarIds = [];
  const eventIds = [];
  _.forEach(items, ({ item, type }) => {
    if (type === permissionConfigCalendar.type) {
      calendarIds.push(item);
    } else {
      eventIds.push(item);
    }
  });

  promises = [
    table.calendars.find(
      { id_$in: calendarIds },
      {
        transacting,
      }
    ),
    await Promise.all(
      _.map(calendarIds, (calendarId) =>
        getEvents(calendarId, {
          getPrivates: false,
          transacting,
        })
      )
    ),
    table.events.find(
      { id_$in: eventIds },
      {
        transacting,
      }
    ),
    table.classCalendar.find({ calendar_$in: calendarIds }, { transacting }),
  ];

  if (calendarConfig)
    promises.push(
      getCalendars(calendarConfig.id, {
        withEvents: true,
        transacting,
      })
    );
  const [calendars, eventsCalendars, events, classCalendars, configCalendars] = await Promise.all(
    promises
  );

  const eventsFromCalendars = _.flatten(eventsCalendars);

  // ES: Buscamos si el user agent tiene calendario
  // EN: We check if the user agent has a calendar
  const userCalendar = _.find(calendars, {
    key: userPlugin.services.users.getUserAgentCalendarKey(userSession.userAgents[0].id),
  });
  if (userCalendar) {
    // ES: Si tiene calendario todos los eventos sueltos los asignamos a su calendario
    // EN: If you have a calendar, all single events are assigned to your calendar.
    _.forEach(events, (event, index) => {
      events[index].calendar = userCalendar.id;
    });
  }

  const ownerCalendarIds = _.map(ownerItems, 'item');
  const ownerCalendars = _.filter(
    calendars,
    (calendar) => ownerCalendarIds.indexOf(calendar.id) >= 0
  );

  const finalCalendarsIds = [];
  const finalCalendars = [];

  if (userCalendar) {
    finalCalendars.push(userCalendar);
    finalCalendarsIds.push(userCalendar.id);
  }

  _.forEach(ownerCalendars, (calendar) => {
    if (finalCalendarsIds.indexOf(calendar.id) < 0) {
      // eslint-disable-next-line no-param-reassign
      calendar.section = 'plugins.users.calendar.user_section';
      finalCalendars.push(calendar);
      finalCalendarsIds.push(calendar.id);
    }
  });

  _.forEach(calendars, (calendar) => {
    if (finalCalendarsIds.indexOf(calendar.id) < 0) {
      finalCalendars.push(calendar);
      finalCalendarsIds.push(calendar.id);
    }
  });

  let configCalendarEvents = [];
  if (_.isArray(configCalendars)) {
    _.forEach(configCalendars, (calendar) => {
      configCalendarEvents = configCalendarEvents.concat(calendar.events);
      // eslint-disable-next-line no-param-reassign
      delete calendar.events;
      // eslint-disable-next-line no-param-reassign
      calendar.section = 'plugins.users.calendar.user_section';
      finalCalendars.push(calendar);
    });
  }

  const classCalendarsIds = _.map(classCalendars, 'calendar');

  // console.log('EVENTS --------', events);
  // console.log('EVENTS CALENDARS --------', eventsFromCalendars);

  const calendarFunc = (calendar) => ({
    ...calendar,
    isClass: classCalendarsIds.indexOf(calendar.id) >= 0,
    isUserCalendar: calendar.id === userCalendar.id,
    image: calendar.id === userCalendar.id ? userSession.avatar : null,
    fullName:
      calendar.id === userCalendar.id
        ? leemons.getPlugin('users').services.users.getUserFullName(userSession)
        : calendar.name,
  });

  // ES: Resultados con todos los eventos y calendarios a los que tiene acceso el usuario
  const result = {
    userCalendar,
    ownerCalendars: _.sortBy(_.map(ownerCalendars, calendarFunc), ({ id }) =>
      id === userCalendar.id ? 0 : 1
    ),
    calendarConfig,
    configCalendars,
    calendars: _.sortBy(_.map(finalCalendars, calendarFunc), ({ id }) =>
      id === userCalendar.id ? 0 : 1
    ),
    events: _.uniqBy(
      eventsFromCalendars
        .map((e) => ({
          ...e,
          fromCalendar: true,
        }))
        .concat(events)
        .concat(configCalendarEvents)
        .map((event) => ({
          ...event,
          data: _.isString(event.data) ? JSON.parse(event.data) : event.data,
        })),
      'id'
    ),
  };

  // Si el usuario esta contextualizado por el programa, quitamos los calendarios y eventos que no pertemezcan a dicho programa
  if (userSession.sessionConfig?.program) {
    let usedCalendarIds = _.map(result.ownerCalendars, 'id');
    usedCalendarIds = usedCalendarIds.concat(_.map(result.calendars, 'id'));
    usedCalendarIds = _.uniq(usedCalendarIds);
    // Cogemos las ids de los calendarios que entre los que tenemos sabemos que no pertenecen a nuestro programa
    const [noClassCalendars, noProgramCalendars, calendarConfig] = await Promise.all([
      table.classCalendar.find(
        {
          calendar_$in: usedCalendarIds,
          program_$ne: userSession.sessionConfig?.program,
        },
        { transacting }
      ),
      table.programCalendar.find(
        {
          calendar_$in: usedCalendarIds,
          program_$ne: userSession.sessionConfig?.program,
        },
        { transacting }
      ),
    ]);

    const calendarIdsToRemove = _.map(noClassCalendars, 'calendar').concat(
      _.map(noProgramCalendars, 'calendar')
    );
    result.ownerCalendars = _.filter(
      result.ownerCalendars,
      ({ id }) => !calendarIdsToRemove.includes(id)
    );
    result.calendars = _.filter(result.calendars, ({ id }) => !calendarIdsToRemove.includes(id));
    result.events = _.filter(result.events, ({ calendar, data }) => {
      if (data && _.isArray(data.classes) && data.classes.length) {
        if (_.intersection(data.classes, calendarIdsToRemove).length > 0) {
          return false;
        }
      }
      return !calendarIdsToRemove.includes(calendar);
    });
  }

  const calendarByProgramId = {};
  let programIds = [];
  const allCalendars = result.calendars.concat(result.ownerCalendars);
  _.forEach(allCalendars, ({ id, section, key }) => {
    if (key.startsWith('plugins.calendar.program.')) {
      const split = key.split('.');
      programIds.push(split[split.length - 1]);
      calendarByProgramId[split[split.length - 1]] = id;
    }
  });

  programIds = _.uniq(programIds);

  const [programs, isAcademic, ...calendarConfigs] = await Promise.all([
    leemons
      .getPlugin('academic-portfolio')
      .services.programs.programsByIds(programIds, { transacting }),
    leemons
      .getPlugin('academic-portfolio')
      .services.config.userSessionIsAcademic(userSession, { transacting }),
    ..._.map(programIds, (programId) =>
      leemons.getPlugin('academic-calendar').services.config.getConfig(programId, { transacting })
    ),
  ]);

  let courses = [];

  if (isAcademic) {
    let classes = await Promise.all(
      _.map(programs, (program) =>
        leemons
          .getPlugin('academic-portfolio')
          .services.classes.listSessionClasses(
            userSession,
            { program: program.id },
            { transacting }
          )
      )
    );
    classes = _.flatten(classes);
    _.forEach(classes, (classe) => {
      if (_.isArray(classe.courses)) {
        courses = courses.concat(classe.courses);
      } else {
        courses.push(classe.courses);
      }
    });

    courses = _.uniqBy(courses, 'id');
  }

  const programById = _.keyBy(programs, 'id');
  const coursesById = _.keyBy(courses, 'id');

  const { getCourseName } = leemons.getPlugin('academic-portfolio').services.courses;

  _.forEach(calendarConfigs, (config) => {
    if (config) {
      _.forIn(config.courseDates, (value, key) => {
        let good = true;
        if (isAcademic) {
          good = !!coursesById[key];
        }
        if (good) {
          const course = _.find(programById[config.program].courses, { id: key });
          const startEvent = {
            id: null,
            title: `{-_start_-}: ${getCourseName(course)} ${programById[config.program].name}`,
            startDate: value.startDate,
            endDate: value.startDate,
            isAllDay: 1,
            repeat: 'dont_repeat',
            type: 'plugins.calendar.event',
            status: 'active',
            data: { hideInCalendar: false },
            isPrivate: 0,
            calendar: calendarByProgramId[config.program],
            fromCalendar: true,
            // bgColor: '#485264',
            // borderColor: '#485264',
            icon: '/public/calendar/arrow-chev-right.svg',
            canNotOpened: true,
          };
          result.events.push(startEvent);
          result.events.push({
            ...startEvent,
            title: `{-_end_-}: ${getCourseName(course)} ${programById[config.program].name}`,
            startDate: value.endDate,
            endDate: value.endDate,
            icon: '/public/calendar/arrow-chev-left.svg',
          });
        }
      });
    }
  });

  /*
  * {
  id: '202f491f-9fbe-42cc-bb16-0e569d0fa0f4',
  title: 'Inicio de curso',
  startDate: 2021-09-08T00:00:00.000Z,
  endDate: 2021-09-08T00:00:00.000Z,
  isAllDay: 1,
  repeat: 'dont_repeat',
  type: 'plugins.calendar.event',
  status: 'active',
  data: { hideInCalendar: false },
  isPrivate: 0,
  deleted: 0,
  created_at: 2022-06-20T13:54:12.000Z,
  updated_at: 2022-06-20T13:54:12.000Z,
  deleted_at: null,
  calendar: '02d9f2cc-c3db-4a82-af8e-9b24c36ef980',
  fromCalendar: true
}
*/

  const permissionNames = [];

  _.forEach(result.events, (event) => {
    permissionNames.push(getPermissionConfigEvent(event.id).permissionName);
  });

  // ES: Sacamos para todos los eventos que userAgents tiene permiso de ver y cuales son sus owers
  const [viewPermissions, _ownerPermissions] = await Promise.all([
    leemons.getPlugin('users').services.permissions.findUserAgentsWithPermission(
      {
        permissionName_$in: permissionNames,
        actionNames: ['view'],
      },
      { returnUserAgents: false, transacting }
    ),
    leemons.getPlugin('users').services.permissions.findUserAgentsWithPermission(
      {
        permissionName_$in: permissionNames,
        actionNames: ['owner'],
      },
      { returnUserAgents: false, transacting }
    ),
  ]);

  let [assignations, instances, kanbanColumns] = [[], [], []];
  const instanceIdEvents = {};
  try {
    const instancePromises = [];
    const assignationsPromises = [];
    const instanceService = leemons.getPlugin('assignables').services.assignableInstances;
    const assignationsService = leemons.getPlugin('assignables').services.assignations;

    _.forEach(result.events, (event) => {
      if (event?.data?.instanceId) {
        instancePromises.push(
          instanceService.getAssignableInstance(event.data.instanceId, {
            details: true,
            userSession,
            transacting,
          })
        );
        assignationsPromises.push(
          assignationsService.getAssignation(event.data.instanceId, userSession.userAgents[0].id, {
            userSession,
            transacting,
          })
        );
        instanceIdEvents[event.id] = event.data.instanceId;
      }
    });

    const [_assignations, _instances, _kanbanColumns] = await Promise.all([
      Promise.allSettled(assignationsPromises),
      Promise.allSettled(instancePromises),
      leemons.plugin.services.kanban.listColumns({ transacting }),
    ]);

    assignations = _.map(_.filter(_assignations, { status: 'fulfilled' }), 'value');
    instances = _.map(_.filter(_instances, { status: 'fulfilled' }), 'value');
    kanbanColumns = _kanbanColumns;
  } catch (e) {
    console.error(e);
  }

  console.log('instances', instances);

  const instancesById = _.keyBy(instances, 'id');
  const assignationsByInstance = _.keyBy(assignations, 'instance');

  const userAgentIds = _.uniq(_.map(viewPermissions, 'userAgent'));
  const permissionsByName = _.groupBy(viewPermissions, 'permissionName');
  const ownerPermissionsByName = _.groupBy(_ownerPermissions, 'permissionName');

  const userAgents = await await leemons
    .getPlugin('users')
    .services.users.getUserAgentsInfo(userAgentIds, { transacting });

  const userAgentsById = _.keyBy(userAgents, 'id');

  const currentUserAgentIds = _.map(userSession.userAgents, 'id');
  const kanbanColumnsByOrder = _.keyBy(kanbanColumns, 'order');

  // Procesamos todos los eventos para meterles sus userAgents y si son de instancias calcular la columna
  result.events = _.omitBy(
    _.map(result.events, (event) => {
      // --- User agents
      event.users = [];
      event.owners = [];
      event.userAgents = [];
      const permName = getPermissionConfigEvent(event.id).permissionName;
      const ownerPerms = ownerPermissionsByName[permName];
      if (ownerPerms && ownerPerms.length) {
        event.owners = _.map(ownerPerms, 'userAgent');
      }
      const perms = permissionsByName[permName];
      if (perms && perms.length) {
        _.forEach(perms, (perm) => {
          const userAgent = userAgentsById[perm.userAgent];
          if (userAgent && !currentUserAgentIds.includes(userAgent.id)) {
            event.users.push(userAgent.id);
            event.userAgents.push(userAgent);
          }
        });
      }

      if (event.data.instanceId) {
        event.data.hideCalendarField = true;
      }

      // --- Instancia
      if (instanceIdEvents[event.id]) {
        const instance = instancesById[instanceIdEvents[event.id]];
        const assignation = assignationsByInstance[instanceIdEvents[event.id]];

        if (instance && (event.endDate || event.startDate) && instance.dates.deadline) {
          event.startDate = instance.dates.deadline;
          event.endDate = instance.dates.deadline;
        }
        if (instance && assignation) {
          event.disableDrag = true;
          const now = new Date();

          const status = getStatus(assignation, instance);

          if (instance.dates.visualization) {
            // Si hay fecha de visualización
            if (now > new Date(instance.dates.visualization)) {
              // Si la fecha actual es mayor debe de poder ver el evento
              event.data.column = kanbanColumnsByOrder[1].id;
            } else {
              return null;
            }
          }
          // Si siempre tiene que estar disponible lo ponemos en por hacer
          if (instance.alwaysAvailable) {
            event.data.column = kanbanColumnsByOrder[2].id;
          }
          // Si tiene fecha de inicio y la fecha actual es mayor lo ponemos en por hacer
          if (instance.dates.start) {
            if (now > new Date(instance.dates.start)) {
              event.data.column = kanbanColumnsByOrder[2].id;
            } else {
              return null;
            }
          }

          if (status === 'assigned') {
            event.data.column = kanbanColumnsByOrder[1].id;
          }
          if (status === 'opened') {
            event.data.column = kanbanColumnsByOrder[2].id;
          }
          if (status === 'started') {
            event.data.column = kanbanColumnsByOrder[3].id;
          }
          if (status === 'late' || status === 'submitted' || status === 'closed') {
            event.data.column = kanbanColumnsByOrder[4].id;
          }
          if (status === 'evaluated') {
            event.data.column = kanbanColumnsByOrder[5].id;
          }

          /*
          if (instance.dates) {
            if (instance.dates.visualization) {
              // Si hay fecha de visualización
              if (now > new Date(instance.dates.visualization)) {
                // Si la fecha actual es mayor debe de poder ver el evento
                event.data.column = kanbanColumnsByOrder[1].id;
              }
            }
            // Si siempre tiene que estar disponible lo ponemos en por hacer
            if (instance.alwaysAvailable) {
              event.data.column = kanbanColumnsByOrder[2].id;
            }
            // Si tiene fecha de inicio y la fecha actual es mayor lo ponemos en por hacer
            if (instance.dates.start) {
              if (now > new Date(instance.dates.start)) {
                event.data.column = kanbanColumnsByOrder[2].id;
              }
            }
          }
          // Si ya ha empezado con la tarea
          if (assignation.timestamps?.start) {
            event.data.column = kanbanColumnsByOrder[3].id;
          }
          if (instance.dates) {
            if (instance.dates.deadline) {
              if (now > new Date(instance.dates.deadline)) {
                event.data.column = kanbanColumnsByOrder[5].id;
              }
            }
          }
          console.log(assignation);
          if (assignation.finished) {
            event.data.column = kanbanColumnsByOrder[5].id;
          }

           */
          if (!event.data.column) {
            return null;
          }
        }
      }
      return event;
    }),
    _.isNil
  );

  return result;
}

module.exports = { getCalendarsToFrontend };

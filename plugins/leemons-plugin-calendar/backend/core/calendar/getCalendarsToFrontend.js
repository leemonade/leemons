/* eslint-disable no-param-reassign */
const _ = require('lodash');
const dayjs = require('dayjs');
const { table } = require('../tables');
const { getPermissionConfig: getPermissionConfigCalendar } = require('./getPermissionConfig');
const { getPermissionConfig: getPermissionConfigEvent } = require('../events/getPermissionConfig');
const { getByCenterId } = require('../calendar-configs');
const { getCalendars } = require('../calendar-configs/getCalendars');
const { getEventsMultipleCalendars } = require('./getEvents');

function hasGrades(studentData) {
  const grades = studentData?.grades;

  if (!grades || !grades.length) {
    return false;
  }

  return grades.some((grade) => grade.type === 'main' && grade.visibleToStudent);
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
  promises.push(
    leemons.getPlugin('users').services.users.getUserAgentsInfo([userSession.userAgents[0].id], {
      withProfile: true,
      withCenter: true,
      transacting,
    })
  );

  if (center) promises.push(getByCenterId(center.id, { transacting }));
  const [items, ownerItems, [userAgent], calendarConfig] = await Promise.all(promises);

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
    getEventsMultipleCalendars(calendarIds, { getPrivates: false, transacting }),
    table.events.find(
      { id_$in: eventIds },
      {
        transacting,
      }
    ),
    table.classCalendar.find({ calendar_$in: calendarIds }, { transacting }),
    leemons
      .getPlugin('academic-portfolio')
      .services.programs.listPrograms(0, 9999, userAgent.center.id, { userSession, transacting }),
  ];

  if (calendarConfig)
    promises.push(
      getCalendars(calendarConfig.id, {
        withEvents: true,
        transacting,
      })
    );
  const [
    _calendars,
    eventsCalendars,
    _events,
    classCalendars,
    { items: programs },
    configCalendars,
  ] = await Promise.all(promises);

  const _eventsFromCalendars = _.flatten(eventsCalendars);

  let eventsFromCalendars = [];
  let events = [];
  let calendars = [];
  if (userAgent.profile.sysName === 'admin') {
    const programIds = _.map(programs, (program) => `plugins.calendar.program.${program.id}`);
    _.forEach(_calendars, (calendar) => {
      if (calendar.section === 'plugins.calendar.programs') {
        if (programIds.includes(calendar.key)) {
          calendars.push(calendar);
        }
      } else if (calendar.key.startsWith('plugins.users.calendar.agent.')) {
        if (calendar.key.includes(userAgent.id)) {
          calendars.push(calendar);
        }
      } else {
        calendars.push(calendar);
      }
    });
    const _calendarIds = _.map(calendars, 'id');
    events = _.filter(_events, (ev) => _calendarIds.includes(ev.calendar));
    eventsFromCalendars = _.filter(_eventsFromCalendars, (ev) =>
      _calendarIds.includes(ev.calendar)
    );
  } else {
    eventsFromCalendars = _eventsFromCalendars;
    calendars = _calendars;
    events = _events;
  }

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
    metadata: calendar.metadata ? JSON.parse(calendar.metadata) : calendar.metadata,
    fullName:
      calendar.id === userCalendar.id
        ? leemons.getPlugin('users').services.users.getUserFullName(userSession)
        : calendar.name,
  });

  // ES: Resultados con todos los eventos y calendarios a los que tiene acceso el usuario
  const result = {
    userCalendar,
    ownerCalendars: _.sortBy(_.map(ownerCalendars, calendarFunc), ({ id, metadata }) => {
      try {
        const met = JSON.parse(metadata);
        return met?.internalId || id === userCalendar.id ? 0 : 1;
      } catch (e) {
        return id === userCalendar.id ? 0 : 1;
      }
    }),
    configCalendars,
    calendars: _.sortBy(_.map(finalCalendars, calendarFunc), ({ id, metadata }) => {
      try {
        const met = JSON.parse(metadata);
        return met?.internalId || id === userCalendar.id ? 0 : 1;
      } catch (e) {
        return id === userCalendar.id ? 0 : 1;
      }
    }),
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
    const [noClassCalendars, noProgramCalendars] = await Promise.all([
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

  /*
    console.time('9');
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
    console.timeEnd('9');

    console.time('10');

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


  console.timeEnd('10');
  */

  const permissionNames = [];

  _.forEach(result.events, (event) => {
    permissionNames.push(getPermissionConfigEvent(event.id).permissionName);
  });

  // ES: Sacamos para todos los eventos que userAgents tiene permiso de ver y cuales son sus owers
  const [viewPermissions, _ownerPermissions, isAcademicStudent] = await Promise.all([
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
    leemons
      .getPlugin('academic-portfolio')
      .services.config.userSessionIsStudent(userSession, { transacting }),
  ]);

  let kanbanColumns = [];
  const instanceIdEvents = {};
  let instanceStatusByInstance = {};
  try {
    const instanceService = leemons.getPlugin('assignables').services.assignableInstances;

    const instanceIds = [];
    _.forEach(result.events, (event) => {
      if (event?.data?.instanceId) {
        instanceIds.push(event?.data?.instanceId);
        instanceIdEvents[event.id] = event.data.instanceId;
      }
    });

    const [instanceStatus, _kanbanColumns] = await Promise.all([
      instanceService.getAssignableInstancesStatus(instanceIds, {
        userSession,
        transacting,
      }),
      leemons.plugin.services.kanban.listColumns({ transacting }),
    ]);

    kanbanColumns = _kanbanColumns;
    instanceStatusByInstance = _.keyBy(instanceStatus, 'instance');
  } catch (e) {
    console.error(e);
  }

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
        const instanceStatus = instanceStatusByInstance[instanceIdEvents[event.id]];

        event.instanceData = instanceStatus;

        if (instanceStatus && (event.endDate || event.startDate) && instanceStatus.dates.deadline) {
          event.startDate = instanceStatus.dates.start;
          event.endDate = instanceStatus.dates.deadline;
        }

        if (instanceStatus?.dates.archived) {
          event.data.hideInCalendar = true;
        }

        // console.log(instanceStatus);

        if (instanceStatus && instanceStatus.assignation) {
          event.disableDrag = true;
          const now = new Date();

          if (instanceStatus.dates.visualization) {
            // Si hay fecha de visualización
            if (now >= new Date(instanceStatus.dates.visualization)) {
              // Si la fecha actual es mayor debe de poder ver el evento
              event.data.column = kanbanColumnsByOrder[1].id;
            } else {
              return null;
            }
          }
          // Si siempre tiene que estar disponible lo ponemos en por hacer
          if (instanceStatus.alwaysAvailable) {
            event.data.column = kanbanColumnsByOrder[2].id;
          }
          // Si tiene fecha de inicio y la fecha actual es mayor lo ponemos en por hacer
          if (instanceStatus.dates.start) {
            if (now >= new Date(instanceStatus.dates.start)) {
              event.data.column = kanbanColumnsByOrder[2].id;
            } else if (!instanceStatus.dates.visualization) {
              return null;
            }
          }

          if (instanceStatus.status === 'assigned') {
            event.data.column = kanbanColumnsByOrder[1].id;
          }
          if (instanceStatus.status === 'opened') {
            event.data.column = kanbanColumnsByOrder[2].id;
          }
          if (instanceStatus.status === 'started') {
            event.data.column = kanbanColumnsByOrder[3].id;
          }
          if (
            instanceStatus.status === 'late' ||
            instanceStatus.status === 'submitted' ||
            instanceStatus.status === 'closed'
          ) {
            event.data.column = kanbanColumnsByOrder[4].id;
          }
          if (instanceStatus.status === 'evaluated') {
            event.data.column = kanbanColumnsByOrder[5].id;
          }

          if (instanceStatus.dates.archived) {
            event.data.column = kanbanColumnsByOrder[6].id;
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

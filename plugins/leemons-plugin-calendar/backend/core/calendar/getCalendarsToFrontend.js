const { getUserAgentCalendarKey, getUserFullName } = require('@leemons/users');
const _ = require('lodash');

const { getByCenterId, getCalendars } = require('../calendar-configs');
const { getPermissionConfig: getPermissionConfigEvent } = require('../events/getPermissionConfig');
const { list: listKanbanColumns } = require('../kanban-columns');

const { getEventsMultipleCalendars } = require('./getEvents');
const { getPermissionConfig: getPermissionConfigCalendar } = require('./getPermissionConfig');

async function getUserPermissionsData({ ctx }) {
  const { userSession } = ctx.meta;
  const calendarPermissionConfig = getPermissionConfigCalendar();
  const eventPermissionConfig = getPermissionConfigEvent();

  // Get the existing item permissions for calendars and events
  const itemPermissions = await ctx.tx.call('users.permissions.findItems', {
    params: {
      type: [calendarPermissionConfig.type, eventPermissionConfig.type],
    },
  });

  const itemPermissionsByName = _.keyBy(itemPermissions, 'permissionName');

  // Get the actual permissions of the user over the item permissions (ps: $in is more efficient than a $or or regex)
  const userPermissions = await ctx.tx.call('users.permissions.getUserAgentPermissions', {
    userAgent: userSession.userAgents,
    query: {
      permissionName: {
        $in: Object.keys(itemPermissionsByName),
      },
    },
  });

  // Calendars and events that the user has permission to view
  const calendars = [];
  const events = [];

  // Calendars that the user is the owner
  const ownedCalendars = [];

  userPermissions.forEach((permission) => {
    const { item, type } = itemPermissionsByName[permission.permissionName];
    const { actionNames } = permission;

    if (type === calendarPermissionConfig.type) {
      calendars.push(item);
    } else if (type === eventPermissionConfig.type) {
      events.push(item);
    }

    if (type === calendarPermissionConfig.type && actionNames.indexOf('owner') >= 0) {
      ownedCalendars.push(item);
    }
  });

  return { calendars, events, ownedCalendars };
}

async function getCalendarsData({ ids, ctx }) {
  const promises = [
    ctx.tx.db.Calendars.find({ id: ids }).lean(),
    ctx.tx.db.ClassCalendar.find({ calendar: ids }).select({ id: 1 }).lean(),
  ];

  const [calendars, classCalendars] = await Promise.all(promises);

  return { calendars, classCalendars: classCalendars.map((calendar) => calendar.id) };
}

async function getEventsData({ ids, calendarIds, ctx }) {
  // TODO: Filter by date
  const promises = [
    ctx.tx.db.Events.find({ id: ids }).lean(),
    getEventsMultipleCalendars({ calendars: calendarIds, getPrivates: false, ctx }).then(_.flatten),
  ];

  const [events, eventsFromCalendars] = await Promise.all(promises);

  return { events, eventsFromCalendars };
}

async function getUserAgentData({ ctx }) {
  const userAgentId = ctx.meta.userSession.userAgents[0].id;

  const [data] = await ctx.tx.call('users.users.getUserAgentsInfo', {
    userAgentIds: [userAgentId],
    withProfile: true,
    withCenter: true,
  });

  return {
    id: data.id,
    center: Array.isArray(data.center) ? data.center[0]?.id : data.center?.id,
    profile: data.profile.sysName,
  };
}

async function filterCalendarDataForUserType({ calendars, events, userAgentData, ctx }) {
  if (userAgentData.profile === 'admin') {
    const programs = await ctx.tx.call('academic-portfolio.programs.listPrograms', {
      page: 0,
      size: 9999,
      center: userAgentData.center,
    });

    const programIds = _.keyBy(programs, 'id');

    const _calendars = calendars.filter((calendar) => {
      if (calendar.section === 'calendar.programs') {
        return !!programIds[calendar.key]; // Include calendars from user programs
      } else if (calendar.key.startsWith('users.calendar.agent.')) {
        return calendar.key.includes(userAgentData.id); // Include calendars from the user agent
      }
      return true; // Include all other calendars
    });

    const calendarsById = _.keyBy(_calendars, 'id');

    return {
      classCalendars: calendars.classCalendars,
      calendars: _calendars,
      events: events.events.filter((event) => !!calendarsById[event.calendar]),
      eventsFromCalendar: events.eventsFromCalendar.filter(
        (event) => !!calendarsById[event.calendar]
      ),
    };
  }

  return {
    ...events,
    ...calendars,
  };
}

function getUserCalendar({ calendars, ctx }) {
  const userAgent = ctx.meta.userSession.userAgents[0].id;
  const userAgentCalendarKey = getUserAgentCalendarKey({ userAgent });

  return calendars.find((calendar) => calendar.key === userAgentCalendarKey);
}

function linkEventsToUserCalendar({ events, userCalendar, ctx }) {
  events.forEach((event) => {
    event.calendar = userCalendar.id;
  });
}

function getOwnedCalendars({ ids, calendars, ctx }) {
  const calendarIds = new Set(ids);
  return calendars.filter(
    (calendar) => calendar.section === 'users.calendar.user_section' && calendarIds.has(calendar.id)
  );
}

function getFinalCalendars({ userCalendar, ownedCalendars, calendars, configCalendars }) {
  const finalCalendars = new Set();
  const finalCalendarsIds = new Set();

  if (userCalendar) {
    finalCalendars.add(userCalendar);
    finalCalendarsIds.add(userCalendar.id);
  }

  ownedCalendars.forEach((calendar) => {
    if (!finalCalendarsIds.has(calendar.id)) {
      finalCalendars.add(calendar);
      finalCalendarsIds.add(calendar.id);
    }
  });

  calendars.forEach((calendar) => {
    if (!finalCalendarsIds.has(calendar.id)) {
      finalCalendars.add(calendar);
      finalCalendarsIds.add(calendar.id);
    }
  });

  let configCalendarEvents = [];
  if (Array.isArray(configCalendars)) {
    configCalendars.forEach((calendar) => {
      configCalendarEvents = configCalendarEvents.concat(calendar.events);
      delete calendar.events;
      calendar.section = 'users.calendar.user_section';

      if (!finalCalendarsIds.has(calendar.id)) {
        finalCalendars.add(calendar);
        finalCalendarsIds.add(calendar.id);
      }
    });
  }

  return {
    finalCalendars: Array.from(finalCalendars),
    finalCalendarsIds: Array.from(finalCalendarsIds),
    configCalendarEvents,
  };
}

async function getConfigCalendars({ userAgentData, ctx }) {
  if (!userAgentData.center) {
    return null;
  }

  const calendarConfig = await getByCenterId({ center: userAgentData.center, ctx });

  if (!calendarConfig) {
    return null;
  }

  return await getCalendars({ id: calendarConfig.id, withEvents: true, ctx });
}

function calendarFormatter({ classCalendarsIds, userCalendar, ctx }) {
  const classCalendarsIdsSet = new Set(classCalendarsIds);
  const { userSession } = ctx.meta;

  return (calendar) => ({
    ...calendar,
    isClass: classCalendarsIdsSet.has(calendar.id),
    isUserCalendar: calendar.id === userCalendar?.id,
    image: calendar.id === userCalendar?.id ? userSession.avatar : null,
    metadata: calendar.metadata ? JSON.parse(calendar.metadata || null) : calendar.metadata,
    fullName: calendar.id === userCalendar?.id ? getUserFullName({ userSession }) : calendar.name,
  });
}

function sortCalendars(calendars, userCalendar) {
  return _.sortBy(calendars, ({ id, metadata }) => {
    try {
      const met = JSON.parse(metadata || null);
      return met?.internalId || id === userCalendar?.id ? 0 : 1;
    } catch (e) {
      return id === userCalendar?.id ? 0 : 1;
    }
  });
}

function getResult({
  calendars,
  events,
  userCalendar,
  ownedCalendars,
  classCalendarsIds,
  eventsFromCalendars,
  configCalendarEvents,
  configCalendars,
  ctx,
}) {
  const formatCalendar = calendarFormatter({ classCalendarsIds, userCalendar, ctx });

  return {
    userCalendar: formatCalendar(userCalendar),
    ownerCalendars: sortCalendars(_.map(ownedCalendars, formatCalendar), userCalendar),
    calendars: sortCalendars(_.map(calendars, formatCalendar), userCalendar),
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
          data: _.isString(event.data) ? JSON.parse(event.data || null) : event.data,
        })),
      'id'
    ),
    configCalendars,
  };
}

async function getCalendarsToRemove({ result, ctx }) {
  const { sessionConfig } = ctx.meta.userSession;

  if (!sessionConfig.program) {
    return [];
  }

  const { program } = sessionConfig;

  const calendarIds = result.ownerCalendars.concat(result.calendars).map((calendar) => calendar.id);

  const [noClassCalendars, noProgramCalendars] = await Promise.all([
    ctx.tx.db.ClassCalendar.find({
      calendar: calendarIds,
      program: { $ne: program },
    })
      .select({ calendar: 1 })
      .lean(),
    ctx.tx.db.ProgramCalendar.find({
      calendar: calendarIds,
      program: { $ne: program },
    })
      .select({ calendar: 1 })
      .lean(),
  ]);

  const calendarIdsToRemove = new Set();
  noClassCalendars
    .concat(noProgramCalendars)
    .forEach(({ calendar }) => calendarIdsToRemove.add(calendar));

  return calendarIdsToRemove;
}

async function removeNonCurrentProgramCalendarsAndEvents({ result, ctx }) {
  const calendarsToRemove = await getCalendarsToRemove({ result, ctx });

  if (calendarsToRemove.size) {
    result.ownerCalendars = result.ownerCalendars.filter(
      (calendar) => !calendarsToRemove.has(calendar.id)
    );
    result.calendars = result.calendars.filter((calendar) => !calendarsToRemove.has(calendar.id));
    result.events = result.events.filter(({ calendar, data }) => {
      if (calendarsToRemove.has(calendar)) {
        return false;
      }

      if (data && Array.isArray(data.classes)) {
        return !data.classes.some((classCalendarId) => calendarsToRemove.has(classCalendarId));
      }

      return true;
    });
  }

  return result;
}

async function getKanbanColumnsData({ result, showHiddenColumns, ctx }) {
  let kanbanColumns = [];
  const instanceIdEvents = {};
  let instanceStatusByInstance = {};
  let instancesById = {};

  try {
    const instanceIds = [];

    result.events.forEach((event) => {
      if (event?.data?.instanceId) {
        instanceIds.push(event?.data?.instanceId);
        instanceIdEvents[event.id] = event.data.instanceId;
      }
    });

    const [instanceStatus, _kanbanColumns, instances] = await Promise.all([
      ctx.tx.call('assignables.assignableInstances.getAssignableInstancesStatus', {
        assignableInstanceIds: instanceIds,
      }),
      listKanbanColumns({ showHiddenColumns, ctx }),
      ctx.tx.call('assignables.assignableInstances.getAssignableInstances', {
        ids: instanceIds,
        details: true,
      }),
    ]);

    kanbanColumns = _kanbanColumns;
    instanceStatusByInstance = _.keyBy(instanceStatus, 'instance');
    instancesById = _.keyBy(instances, 'id');
  } catch (e) {
    console.error(e);
  }

  const kanbanColumnsByOrder = _.keyBy(kanbanColumns, 'order');

  return {
    kanbanColumns: kanbanColumnsByOrder,
    instanceStatusByInstance,
    instanceIdEvents,
    instancesById,
  };
}

async function getEventPermissionsAndUsers({ result, ctx }) {
  const { userSession } = ctx.meta;
  const permissionNames = [];

  _.forEach(result.events, (event) => {
    permissionNames.push(getPermissionConfigEvent(event.id).permissionName);
  });

  const [viewPermissions, _ownerPermissions] = await Promise.all([
    ctx.tx.call('users.permissions.findUserAgentsWithPermission', {
      permissions: {
        permissionName: permissionNames,
        actionNames: ['view'],
      },
      returnUserAgents: false,
    }),
    ctx.tx.call('users.permissions.findUserAgentsWithPermission', {
      permissions: {
        permissionName: permissionNames,
        actionNames: ['owner'],
      },
      returnUserAgents: false,
    }),
  ]);

  const userAgentIds = _.uniq(_.map(viewPermissions, 'userAgent'));
  const permissionsByName = _.groupBy(viewPermissions, 'permissionName');
  const ownerPermissionsByName = _.groupBy(_ownerPermissions, 'permissionName');

  const userAgents = await ctx.tx.call('users.users.getUserAgentsInfo', { userAgentIds });

  const userAgentsById = _.keyBy(userAgents, 'id');

  const currentUserAgentIds = new Set(_.map(userSession.userAgents, 'id'));

  return {
    permissionsByName,
    ownerPermissionsByName,

    userAgentsById,
    currentUserAgentIds,
  };
}

async function addUsersToEvent({
  event,
  permissionsByName,
  ownerPermissionsByName,
  userAgentsById,
  currentUserAgentIds,
}) {
  event.users = [];
  event.owners = [];
  event.userAgents = [];

  const { permissionName } = getPermissionConfigEvent(event.id);
  const ownerPermissions = ownerPermissionsByName[permissionName];

  if (ownerPermissions?.length) {
    event.owners = _.map(ownerPermissions, 'userAgent');
  }

  const permissions = permissionsByName[permissionName];

  if (permissions?.length) {
    permissions?.forEach((permission) => {
      const userAgent = userAgentsById[permission.userAgent];

      if (userAgent && !currentUserAgentIds.has(userAgent.id)) {
        event.users.push(userAgent.id);
        event.userAgents.push(userAgent);
      }
    });
  }

  return event;
}

async function addKanbanDataToEvent({
  event,
  kanbanColumns,
  instanceStatusByInstance,
  instancesById,
  instanceIdEvents,
}) {
  if (event.data.instanceId) {
    event.data.hideCalendarField = true;
  }

  // --- Instancia
  if (instanceIdEvents[event.id]) {
    const instanceStatus = instanceStatusByInstance[instanceIdEvents[event.id]];
    const instance = instancesById[instanceIdEvents[event.id]];

    event.instanceData = {
      ...instanceStatus,
      instance,
    };

    if (instanceStatus && (event.endDate || event.startDate) && instanceStatus.dates.deadline) {
      event.startDate = instanceStatus.dates.start;
      event.endDate = instanceStatus.dates.deadline;
    }

    if (instanceStatus?.dates.archived) {
      event.data.hideInCalendar = true;
    }

    if (instanceStatus) {
      event.disableDrag = true;
      const now = new Date();

      if (instanceStatus.assignation) {
        if (instanceStatus.dates.visualization) {
          // Si hay fecha de visualización
          if (now >= new Date(instanceStatus.dates.visualization)) {
            // Si la fecha actual es mayor debe de poder ver el evento
            event.data.column = kanbanColumns[1]?.id;
          } else {
            return null;
          }
        }
        // Si siempre tiene que estar disponible lo ponemos en por hacer
        if (instanceStatus.alwaysAvailable) {
          event.data.column = kanbanColumns[2].id;
        }
        // Si tiene fecha de inicio y la fecha actual es mayor lo ponemos en por hacer
        if (instanceStatus.dates.start) {
          if (now >= new Date(instanceStatus.dates.start)) {
            event.data.column = kanbanColumns[2].id;
          } else if (!instanceStatus.dates.visualization) {
            return null;
          }
        }
      }

      if (instanceStatus.status === 'assigned') {
        event.data.column = kanbanColumns[1]?.id;
      }
      if (instanceStatus.status === 'opened') {
        event.data.column = kanbanColumns[2].id;
      }
      if (instanceStatus.status === 'started') {
        event.data.column = kanbanColumns[3].id;
      }
      if (
        instanceStatus.status === 'late' ||
        instanceStatus.status === 'submitted' ||
        instanceStatus.status === 'closed'
      ) {
        event.data.column = kanbanColumns[4].id;
      }
      if (instanceStatus.status === 'evaluated') {
        event.data.column = kanbanColumns[5].id;
      }

      if (instanceStatus.dates.archived) {
        event.data.column = kanbanColumns[6].id;
      }

      if (!event.data.column) {
        return null;
      }
    }
  }
}

async function getCalendarsToFrontend({ showHiddenColumns, ctx }) {
  const {
    calendars: calendarsIds,
    events: eventsIds,
    ownedCalendars: ownedCalendarsIds,
  } = await getUserPermissionsData({ ctx });

  const [userAgentData, calendarsData, eventsData] = await Promise.all([
    getUserAgentData({ ctx }),
    getCalendarsData({ ids: calendarsIds, ctx }),
    getEventsData({ ids: eventsIds, calendarIds: calendarsIds, ctx }),
  ]);

  const configCalendars = await getConfigCalendars({ userAgentData, ctx });

  const {
    calendars,
    events,
    eventsFromCalendars,
    classCalendars: classCalendarsIds,
  } = await filterCalendarDataForUserType({
    calendars: calendarsData,
    events: eventsData,
    userAgentData,
    ctx,
  });

  const userCalendar = getUserCalendar({ calendars, ctx });

  if (userCalendar) {
    linkEventsToUserCalendar({ events, userCalendar, ctx });
  }

  const ownedCalendars = getOwnedCalendars({ ids: ownedCalendarsIds, calendars, ctx });
  const { finalCalendars, configCalendarEvents } = getFinalCalendars({
    userCalendar,
    ownedCalendars,
    calendars,
    configCalendars,
  });

  let result = getResult({
    calendars: finalCalendars,
    events,
    userCalendar,
    ownedCalendars,
    classCalendarsIds,
    eventsFromCalendars,
    configCalendarEvents,
    configCalendars,
    ctx,
  });

  result = await removeNonCurrentProgramCalendarsAndEvents({ result, ctx });

  const kanbanData = await getKanbanColumnsData({ result, showHiddenColumns, ctx });

  const eventPermissionsAndUsers = await getEventPermissionsAndUsers({ result, ctx });

  result.events
    .map((event) => {
      let _event = addUsersToEvent({
        ...eventPermissionsAndUsers,
        event,
      });

      _event = addKanbanDataToEvent({
        ...kanbanData,
        event,
      });

      return _event;
    })
    .filter((event) => !_.isNil(event));

  return result;
}

module.exports = { getCalendarsToFrontend };

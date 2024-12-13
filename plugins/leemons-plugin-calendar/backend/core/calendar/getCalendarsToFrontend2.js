const { getUserAgentCalendarKey, getUserFullName } = require('@leemons/users');
const _ = require('lodash');

const { getByCenterId, getCalendars } = require('../calendar-configs');
const { getPermissionConfig: getPermissionConfigEvent } = require('../events/getPermissionConfig');

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

  const result = getResult({
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

  console.log('result', result);
}

module.exports = { getCalendarsToFrontend };

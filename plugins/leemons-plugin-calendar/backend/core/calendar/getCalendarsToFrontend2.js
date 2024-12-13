const { getUserAgentCalendarKey, getUserFullName } = require('@leemons/users');
const assert = require('assert');
const _ = require('lodash');

const { getByCenterId } = require('../calendar-configs');
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
    ctx.tx.db.ClassCalendar.find({ calendar: ids }).lean(),
  ];

  const [calendars, classCalendars] = await Promise.all(promises);

  return { calendars, classCalendars };
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

function areItemsEqual(items, expectedItems) {
  const itemsByName = _.keyBy(items, 'permissionName');
  const expectedItemsByName = _.keyBy(expectedItems, 'permissionName');

  const isEqual =
    items.length === expectedItems.length &&
    _.every(itemsByName, (item, key) =>
      _.isEqualWith(item, expectedItemsByName[key], (a, b) => {
        if (Array.isArray(a.actionNames) && Array.isArray(b.actionNames)) {
          return _.isEqual(a.actionNames.sort(), b.actionNames.sort());
        }
        return isEqual(a, b);
      })
    );

  if (!isEqual) {
    const differentItems = Object.keys(itemsByName).filter(
      (key) =>
        !_.isEqualWith(itemsByName[key], expectedItemsByName[key], (a, b) => {
          if (Array.isArray(a.actionNames) && Array.isArray(b.actionNames)) {
            return _.isEqual(a.actionNames.sort(), b.actionNames.sort());
          }
          return isEqual(a, b);
        })
    );
    console.log({
      length: items.length,
      expectedLength: expectedItems.length,
      diff: differentItems,
    });
  }

  return isEqual;
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
    center: data.center.id,
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

  const { calendars, events, classCalendars } = await filterCalendarDataForUserType({
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

  console.log('calendars', calendars);
}

module.exports = { getCalendarsToFrontend };

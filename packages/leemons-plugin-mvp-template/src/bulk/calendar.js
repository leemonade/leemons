/* eslint-disable no-await-in-loop */
const path = require('path');
const { keys, isString, isEmpty, isNaN, trim, isNil } = require('lodash');
const itemsImport = require('./helpers/simpleListImport');

async function importEvents({ users, programs }) {
  const filePath = path.resolve(__dirname, 'data.xlsx');
  const items = await itemsImport(filePath, 'calendar', 40, true, true);

  const { services } = leemons.getPlugin('calendar');
  const kanbanColumns = await services.kanban.listColumns();

  console.dir(kanbanColumns, { depth: null });

  const calendars = {};
  const itemsKeys = keys(items);

  for (let i = 0, l = itemsKeys.length; i < l; i++) {
    const key = itemsKeys[i];
    const event = items[key];

    if (isNaN(event.startDate)) delete event.startDate;
    if (isNaN(event.endDate)) delete event.endDate;

    if (isString(event.startDate) && !isEmpty(event.startDate)) {
      event.startDate = new Date(event.startDate).toISOString();
    }

    if (isString(event.endDate) && !isEmpty(event.endDate)) {
      event.endDate = new Date(event.endDate).toISOString();
    }

    if (event.description && !isEmpty(event.description)) {
      event.data = { ...(event.data || {}), description: event.description };
    }

    if (!isNil(event.hideInCalendar) && !isNaN(event.hideInCalendar)) {
      event.data = { ...(event.data || {}), hideInCalendar: event.hideInCalendar };
    }

    event.type = `plugins.calendar.${event.type}`;

    // ·······························································
    // SUBTASKS

    if (event.subtask && !isEmpty(event.subtask)) {
      event.data = {
        ...(event.data || {}),
        subtask: event.subtask
          .split('|')
          .map((val) => trim(val))
          .filter((val) => !isEmpty(val))
          .map((title) => ({ checked: false, title })),
      };
    }

    // ·······························································
    // KANBAN

    if (event.column) {
      event.data = {
        ...(event.data || {}),
        column: kanbanColumns.find((column) => column.order === event.column)?.id,
      };
    }

    // ·······························································
    // CALENDAR

    let creatorCalendars = calendars[event.creator];

    if (!creatorCalendars) {
      const creator = users[event.creator];
      const userCalendars = await services.calendar.getCalendars(creator);
      // console.dir(keys(userCalendars));

      calendars[event.creator] = userCalendars.ownerCalendars;
      creatorCalendars = userCalendars.ownerCalendars;

      /*
      console.dir(
        creatorCalendars.map(({ id, key: keyProp, name, fullName }) => ({
          id,
          key: keyProp,
          name,
          fullName,
        })),
        { depth: null }
      );
      */
    }

    if (event.calendar && !isEmpty(event.calendar)) {
      let ref = programs[event.calendar];

      // Calendar is a Program
      if (ref) {
        event.calendar = creatorCalendars.find((calendar) => calendar.key.indexOf(ref.id) > 0)?.key;
      }

      // Calendar is a subject
      if (!ref) {
        ref = keys(programs)
          .map((programKey) => programs[programKey])
          .find((program) => program.subjects[event.calendar])?.subjects[event.calendar];

        // TODO: Implement this: Not only search by subject but classroom.

        /*
        console.log('event.calendar:', event.calendar);
        console.log('ref:');
        console.dir(keys(ref), { depth: null });
        */

        if (ref) {
          event.calendar = creatorCalendars.find(
            (calendar) => calendar.key.indexOf(ref.id) > 0
          )?.key;
        }
      }

      // Calendar is a User
      if (!ref) {
        ref = users[event.calendar];

        if (ref) {
          event.calendar = creatorCalendars
            .filter((calendar) => calendar.key.indexOf('users.calendar.agent') > -1)
            .find((calendar) =>
              ref.userAgents.map(({ id }) => id).some((element) => calendar.key.includes(element))
            )?.key;
        }
      }
    }

    delete event.description;
    delete event.hideInCalendar;
    delete event.subtask;
    delete event.column;

    if (event.calendar) {
      items[key] = event;
    } else {
      delete items[key];
    }
  }

  return items;
}

module.exports = importEvents;

/* eslint-disable no-await-in-loop */
const { keys, isString, isEmpty, isNaN: _isNaN, trim, isNil, forEach } = require('lodash');
const itemsImport = require('./helpers/simpleListImport');

function getSubjectAndClassroom(programs, subjectString) {
  const [subjectKey, classroomKey] = subjectString.split('|');
  let subject = null;
  let classroom = null;

  forEach(
    keys(programs).map((programKey) => programs[programKey]),
    (program) => {
      if (program.subjects[subjectKey]) {
        subject = program.subjects[subjectKey];
        return false;
      }
      return true;
    }
  );

  if (subject) {
    classroom = subject.classes.find((item) => item.groups.abbreviation === classroomKey);
  }
  if (!classroomKey && !classroom && subject?.classes?.length) {
    [classroom] = subject.classes;
  }

  return { subject, classroom };
}

async function importEvents({ filePath, config: { users, programs }, ctx }) {
  const items = await itemsImport(filePath, 'calendar', 40, true, true);

  const kanbanColumns = await ctx.call('calendar.kanban.listColumns');
  const kanbanCols = ['', 'backlog', 'todo', 'inprogress', 'underreview', 'done'];

  const calendars = {};
  const itemsKeys = keys(items).filter((key) => !isNil(key) && !isEmpty(key));

  for (let i = 0, l = itemsKeys.length; i < l; i++) {
    const key = itemsKeys[i];
    const event = items[key];

    if (_isNaN(event.startDate)) delete event.startDate;
    if (_isNaN(event.endDate)) delete event.endDate;

    if (isString(event.startDate) && !isEmpty(event.startDate)) {
      event.startDate = new Date(event.startDate).toISOString();
    }

    if (isString(event.endDate) && !isEmpty(event.endDate)) {
      event.endDate = new Date(event.endDate).toISOString();
    }

    if (event.description && !isEmpty(event.description)) {
      event.data = { ...(event.data || {}), description: event.description };
    }

    if (!isNil(event.hideInCalendar) && !_isNaN(event.hideInCalendar)) {
      event.data = { ...(event.data || {}), hideInCalendar: event.hideInCalendar };
    }

    event.type = `calendar.${event.type}`;

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
      const columnIndex = kanbanCols.indexOf(event.column);
      event.data = {
        ...(event.data || {}),
        column: kanbanColumns.find((column) => column.order === columnIndex)?.id,
      };
    }

    // ·······························································
    // CALENDAR

    let creatorCalendars = calendars[event.creator];

    if (!creatorCalendars) {
      const creator = users[event.creator];
      const userCalendars = await ctx.call(
        'calendar.calendar.getCalendars',
        {},
        {
          meta: { userSession: { ...creator } },
        }
      );

      calendars[event.creator] = userCalendars.ownerCalendars;
      creatorCalendars = calendars[event.creator];
    }

    if (event.calendar && !isEmpty(event.calendar)) {
      let ref = programs[event.calendar];

      // Calendar is a Program
      if (ref) {
        event.calendar = creatorCalendars.find((calendar) => calendar.key.indexOf(ref.id) > 0)?.key;
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

          // ES: Si se ha indicado que además del usuario, tenga classes vinculadas
          // EN: If the event has classes linked
          if (event.calendar && event.classes && !isEmpty(event.classes)) {
            const classes = event.classes
              .split(',')
              .map((val) => trim(val))
              .filter((val) => !isEmpty(val));

            const classesData = classes
              .map((item) => {
                const { classroom } = getSubjectAndClassroom(programs, item);

                if (!classroom?.id) return null;

                return creatorCalendars.find((calendar) => calendar.key.indexOf(classroom.id) > 0)
                  ?.id;
              })
              .filter((val) => !isNil(val));

            if (classesData && !isEmpty(classesData)) {
              event.data = {
                ...(event.data || {}),
                classes: classesData,
              };
            }
          }
        }
      }

      // Calendar is a Classroom
      if (!ref) {
        const { classroom } = getSubjectAndClassroom(programs, event.calendar);

        if (classroom) {
          ref = classroom;
        }

        if (ref) {
          event.calendar = creatorCalendars.find(
            (calendar) => calendar.key.indexOf(ref.id) > 0
          )?.key;
        }
      }
    }

    delete event.description;
    delete event.hideInCalendar;
    delete event.subtask;
    delete event.column;
    delete event.classes;

    if (event.calendar) {
      items[key] = event;
    } else {
      delete items[key];
    }
  }

  return items;
}

module.exports = importEvents;

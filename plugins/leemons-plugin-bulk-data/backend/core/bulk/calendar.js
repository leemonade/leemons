/* eslint-disable no-await-in-loop */
const { keys, isString, isEmpty, isNaN: _isNaN, trim, isNil, forEach } = require('lodash');
const itemsImport = require('./helpers/simpleListImport');

function getSubjectAndClassroom(programs, subjectString) {
  const [subjectKey, classroomKey] = subjectString.split('|');
  let subject = null;
  let classroom = null;

  forEach(keys(programs), (programKey) => {
    const program = programs[programKey];
    if (program.subjects[subjectKey]) {
      subject = program.subjects[subjectKey];
    }
  });

  if (subject) {
    const subjectUsesGroups = subject.classes.every((cls) => cls.groups);
    classroom = subject.classes.find((cls) =>
      subjectUsesGroups
        ? cls.groups.index === Number(classroomKey)
        : cls.classWithoutGroupId === classroomKey.padStart(3, '0')
    );
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
      const results = await ctx.call(
        'calendar.calendar.getCalendars',
        {},
        {
          meta: { userSession: { ...creator } },
        }
      );
      // Previously only the userCalendars.ownerCalendars were kept in mind. As a result no tags where being correctly gotten and some events would not be created as a consequence.
      // Now we search all calendars where needed.
      calendars[event.creator] = results; // todo .calendars
      creatorCalendars = calendars[event.creator];
    }

    if (event.calendar && !isEmpty(event.calendar)) {
      let ref = programs[event.calendar];

      // Calendar is a Program
      if (ref) {
        // This has been kept as it was. Searching only within ownerCalendars. Potentially, it should search en creatorCalendars.calendars instead
        event.calendar = creatorCalendars.ownerCalendars.find(
          (calendar) => calendar.key.indexOf(ref.id) > 0
        )?.key;
      }

      // Calendar is a User
      if (!ref) {
        ref = users[event.calendar];

        if (ref) {
          event.calendar = creatorCalendars.ownerCalendars
            .filter((calendar) => calendar.key.indexOf('users.calendar.agent') > -1)
            .find((calendar) =>
              ref.userAgents.map(({ id }) => id).some((element) => calendar.key.includes(element))
            )?.key;

          // ES: Eventos de tipo tarea pueden estar etiquetados con alguna clase (clase, no asignatura)
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

                return creatorCalendars.calendars.find(
                  (calendar) => calendar.key.indexOf(classroom.id) > 0
                )?.id;
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
          event.calendar = creatorCalendars.calendars.find(
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

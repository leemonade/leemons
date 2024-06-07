const { cloneDeep, omit, isEmpty, omitBy, isNil, isArray } = require('lodash');
const { styleCell, booleanToYesNoAnswer } = require('./helpers');
const { sortClassesAccordingToReferenceGroups } = require('./subjectsSheet');
const { KANBAN_COLUMN_NAMES } = require('./config/constants');

const getCalendarReferenceString = ({
  calendarIds: _calendarIds,
  userCalendars,
  subjects,
  users,
}) => {
  const calendarIds = Array.isArray(_calendarIds) ? _calendarIds : [_calendarIds];

  return calendarIds
    .map((calendarId) => {
      const calendar = userCalendars.find((c) => c.id === calendarId);

      if (calendar.isClass) {
        const [, , classIdFromKey] = calendar.key.split('.');
        let matchingClass;
        const subject = subjects.find((s) => {
          matchingClass = s.classes.find(({ id }) => id === classIdFromKey);
          return matchingClass !== undefined;
        });
        if (!subject) return '';

        const subjectUsesReferenceGroups = subject.classes.every((cls) => cls.groups);
        const sortedClasses = sortClassesAccordingToReferenceGroups(
          subjectUsesReferenceGroups,
          subject.classes
        );
        const classIndex = sortedClasses.map((cls) => cls.id).indexOf(classIdFromKey);
        return `${subject.bulkId}|${classIndex + 1}`;
      }

      if (calendar.isUserCalendar) {
        const userAgent = calendar.name;
        const user = users.find((u) => u.userAgents.map((ua) => ua.id).includes(userAgent));
        return user.bulkId;
      }
      return '';
    })
    .join(', ');
};

const getSubtaskString = (subtasks) => (subtasks || []).map((item) => item?.title).join('|');

const procesTaskData = ({ event, userCalendars, subjects, users, kanbanColumns }) => {
  const column = kanbanColumns.find((item) => item.id === event.data.column);
  const columnName = KANBAN_COLUMN_NAMES[column?.order];
  const subtasks = getSubtaskString(event.data.subtask);
  let classes;

  if (event.data.classes?.length) {
    classes = getCalendarReferenceString({
      calendarIds: event.data.classes,
      userCalendars,
      isTask: true,
      subjects,
      users,
    });
  }
  return { column: columnName, subtask: subtasks, classes };
};

const getCreator = (event, users) => {
  const owners = isArray(event.owners) ? event.owners : [event.owners];
  const creator = users.find((user) => user.userAgents.map((ua) => ua.id).includes(owners[0]));
  return creator?.bulkId;
};

async function createCalendarSheet({ workbook, subjects, users, noUsers, ctx }) {
  const worksheet = workbook.addWorksheet('calendar');
  worksheet.columns = [
    { header: 'root', key: 'root', width: 10 },
    { header: 'title', key: 'title', width: 20 },
    { header: 'type', key: 'type', width: 15 },
    { header: 'startDate', key: 'startDate', width: 20 },
    { header: 'endDate', key: 'endDate', width: 20 },
    { header: 'repeat', key: 'repeat', width: 10 },
    { header: 'isAllDay', key: 'isAllDay', width: 10 },
    { header: 'description', key: 'description', width: 30 },
    { header: 'subtask', key: 'subtask', width: 20 },
    { header: 'column', key: 'column', width: 15 },
    { header: 'hideInCalendar', key: 'hideInCalendar', width: 15 },
    { header: 'creator', key: 'creator', width: 20 },
    { header: 'calendar', key: 'calendar', width: 20 },
    { header: 'classes', key: 'classes', width: 20 },
  ];

  // Headers row
  worksheet.addRow({
    root: 'BulkId',
    title: 'Title',
    type: 'Type',
    startDate: 'Start Date',
    endDate: 'End Date',
    repeat: 'Repeat',
    isAllDay: 'Is All Day',
    description: 'Description',
    subtask: 'Subtask',
    column: 'Column',
    hideInCalendar: 'Hide In Calendar',
    creator: 'Creator',
    calendar: 'Calendar',
    classes: 'Classes',
  });
  worksheet.getRow(2).eachCell((cell, colNumber) => {
    if (colNumber === 1) {
      styleCell({ cell, fontColor: 'white', bgColor: 'black' });
    } else {
      styleCell({ cell, fontColor: 'black', bgColor: 'lightBlue' });
    }
  });

  const filteredUsers = users.filter((user) =>
    user.userAgents.every(({ profile }) => profile.sysName !== 'guardian')
  );
  const allUserCalendars = {};
  await Promise.all(
    filteredUsers.map(async (user) => {
      const clonedUser = cloneDeep(user);
      const calendars = await ctx.call(
        'calendar.calendar.getCalendars',
        {},
        {
          ...ctx,
          meta: {
            ...ctx.meta,
            userSession: {
              ...omit(clonedUser, ['bulkId']),
            },
          },
        }
      );
      allUserCalendars[user.bulkId] = calendars;
    })
  );

  const kanbanColumns = await ctx.call('calendar.kanban.listColumns', ctx);

  Object.keys(allUserCalendars).forEach((userId) => {
    const { events, calendars } = allUserCalendars[userId];

    if (!isEmpty(events)) {
      Object.values(events).forEach((event, i) => {
        const bulkId = `event${(i + 1).toString().padStart(2, '0')}`;
        const type = event.type?.split('.')[1];
        const creator = getCreator(event, users);
        const isTask = type === 'task';

        if (noUsers && creator !== 'admin') return;

        const eventObject = {
          root: bulkId,
          title: event.title,
          type,
          startDate: event.startDate,
          endDate: event.endDate,
          isAllDay: booleanToYesNoAnswer(!!event.isAllDay),
          repeat: isTask ? '' : event.repeat,
          description: event.data?.description,
          hideInCalendar: booleanToYesNoAnswer(!!event.data?.hideInCalendar),
          creator,
          calendar: getCalendarReferenceString({
            calendarIds: event.calendar,
            userCalendars: calendars,
            subjects,
            users,
          }),
          ...(isTask
            ? procesTaskData({ event, userCalendars: calendars, subjects, users, kanbanColumns })
            : {}),
        };

        worksheet.addRow(omitBy(eventObject, isNil));
      });
    }
  });
}

module.exports = { createCalendarSheet };

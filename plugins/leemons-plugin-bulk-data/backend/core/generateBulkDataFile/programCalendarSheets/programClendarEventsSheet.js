const { cloneDeep, isEmpty, isArray } = require('lodash');
const { PROGRAM_CALENDAR_EVENT_TYPES } = require('../config/constants');
const { configureSheetColumns, booleanToYesNoAnswer } = require('../helpers');
const { PROGRAM_EVENTS_COLUMN_DEFINITIONS } = require('./columnDefinitions');

const getSubstage = (substage, programSubstages) =>
  programSubstages.find((item) => item.id === substage)?.abbreviation;

const getCourse = (course, programCourses) => {
  const normalizedCourse = isArray(course) ? course[0] : course;
  return programCourses?.find((item) => item.id === normalizedCourse)?.index;
};
const getCourses = (courses, programCourses) => {
  const courseObjects = programCourses.filter((item) => courses.includes(item.id));
  return courseObjects.map((item) => item.index).join('|');
};

const getGroupingFields = (event, program) => {
  const { course, courses, substage } = event;
  if (substage) {
    return { substage: getSubstage(substage, program.substages) };
  }
  if (course) return { courses: getCourse(course, program.courses) };
  if (courses) return { courses: getCourses(courses, program.courses) };
  return null;
};

const normaliizeEvents = (events, eventType) => {
  if (isEmpty(events)) return events;

  if (eventType === PROGRAM_CALENDAR_EVENT_TYPES.SUBSTAGES.type) {
    const [substages] = Object.values(events);
    return Object.keys(substages).map((key) => ({
      ...substages[key],
      substage: key,
    }));
  }

  if (eventType === PROGRAM_CALENDAR_EVENT_TYPES.COURSE.type) {
    return Object.keys(events).map((key) => ({
      ...events[key],
      course: [key],
    }));
  }

  if (eventType === PROGRAM_CALENDAR_EVENT_TYPES.COURSE_EVENTS.type) {
    const allCourseEvents = [];
    Object.keys(events).forEach((key) => {
      const courseEvents = events[key];
      allCourseEvents.push(...courseEvents.map((event) => ({ ...event, course: key })));
    });
    return allCourseEvents;
  }

  return events;
};

const addEventsToWorksheet = ({
  worksheet,
  eventCount,
  events,
  eventType,
  programCalendarBulkId,
  program,
  creator,
}) => {
  const normalizedEvents = normaliizeEvents(cloneDeep(events ?? []), eventType);
  if (isEmpty(normalizedEvents)) return eventCount;

  let count = eventCount;

  normalizedEvents.forEach((event) => {
    count++;
    const bulkId = `prog_event${count.toString().padStart(2, '0')}`;
    const eventObject = {
      root: bulkId,
      eventType,
      programCalendar: programCalendarBulkId,
      eventName: event.name || event.periodName,
      startDate: event.startDate,
      endDate: event.endDate,
      creator,
      ...(getGroupingFields(event, program) ?? {}),
    };

    if (eventType === PROGRAM_CALENDAR_EVENT_TYPES.COURSE_EVENTS.type) {
      eventObject.color = event.color;
      eventObject.dayType = event.dayType;
      eventObject.ordinaryClasses = booleanToYesNoAnswer(!event.withoutOrdinaryDays);
    }

    worksheet.addRow(eventObject);
  });

  return count;
};

function createProgramCalendarEventsSheet({ workbook, programCalendars }) {
  const worksheet = workbook.addWorksheet('ac_program_calendar_events');
  configureSheetColumns({
    worksheet,
    withGroupedTitles: true,
    columnDefinitions: PROGRAM_EVENTS_COLUMN_DEFINITIONS,
  });

  let eventCount = 0;
  programCalendars.forEach((calendar) => {
    const { bulkId: programCalendarBulkId } = calendar;

    Object.values(PROGRAM_CALENDAR_EVENT_TYPES).forEach((eventType) => {
      const { type, calendarField } = eventType;

      eventCount = addEventsToWorksheet({
        worksheet,
        events: calendar[calendarField],
        eventType: type,
        eventCount,
        programCalendarBulkId,
        program: calendar.program,
      });
    });
  });
}

module.exports = { createProgramCalendarEventsSheet };

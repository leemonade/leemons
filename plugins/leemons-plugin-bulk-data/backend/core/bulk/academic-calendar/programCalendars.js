const { keys, isNil, isEmpty, trim, values, omit } = require('lodash');
const itemsImport = require('../helpers/simpleListImport');

const getBreakEvents = (events, program) =>
  values(events)
    .filter(({ eventType }) => eventType === 'breaks')
    .map((event) => {
      const courseIndexes = (String(event.courses) || '')
        .split('|')
        .map((val) => trim(val))
        .filter((val) => !isEmpty(val))
        .map((val) => parseInt(val));
      const coursesIds = courseIndexes.map((index) => {
        const course = program.courses.find((cs) => cs.index === index);
        return course?.id;
      });

      return {
        startDate: event.startDate,
        endDate: event.endDate,
        name: event.eventName,
        courses: coursesIds,
      };
    });

const getCourseData = ({ events, filterBy, program }) =>
  values(events)
    .filter(({ eventType }) => eventType === filterBy)
    .reduce((acc, event) => {
      const course = program.courses.find((cs) => cs.index === event.courses);
      if (course) {
        acc[course.id] = {
          startDate: event.startDate,
          endDate: event.endDate,
        };
      }
      return acc;
    }, {});

// TODO: Substages do have a valid index value, use that instead here and during excel file generation
function getSubstageDates({ events, program }) {
  return program.courses.reduce((acc, course) => {
    acc[course.id] = {};

    values(events)
      .filter(({ eventType }) => eventType === 'substages')
      .forEach((event) => {
        const substage = program.substages.find((ss) => ss.abbreviation === event.substage);
        if (substage) {
          acc[course.id][substage.id] = {
            startDate: event.startDate,
            endDate: event.endDate,
          };
        }
      });

    return acc;
  }, {});
}

async function importProgramCalendars(filePath, config) {
  const programRegionalCalendarConfig = await itemsImport(
    filePath,
    'ac_program_calendars',
    40,
    false,
    false
  );
  const eventItems = await itemsImport(filePath, 'ac_program_calendar_events', 40, true, true);

  keys(programRegionalCalendarConfig)
    .filter((key) => !isNil(key) && !isEmpty(key))
    .forEach((key) => {
      const programConfig = programRegionalCalendarConfig[key];
      const program = config.programs[programConfig.program];

      programConfig.regionalConfig = config.regionalCalendars[programConfig.regionalConfig]?.id;
      programConfig.program = program.id;

      programConfig.breaks = getBreakEvents(eventItems, program);
      programConfig.courseDates = getCourseData({
        events: eventItems,
        filterBy: 'course-events',
        program,
      });
      programConfig.courseEvents = getCourseData({
        events: eventItems,
        filterBy: 'course',
        program,
      });
      programConfig.substagesDats = getSubstageDates({
        events: eventItems,
        program,
      });
    });

  return programRegionalCalendarConfig;
}

module.exports = importProgramCalendars;

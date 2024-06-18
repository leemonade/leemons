const GROUP_TITLES = {
  courseEventsData: {
    title: 'Course Events Data',
    style: {
      bgColor: 'black',
      fontColor: 'white',
    },
  },
};

// Start Generation Here
const PROGRAM_EVENTS_COLUMN_DEFINITIONS = {
  root: {
    title: 'Root',
    width: 20,
    style: { fontColor: 'white', bgColor: 'black' },
  },
  programCalendar: { title: 'Program Calendar', width: 20 },
  eventType: { title: 'Event Type', width: 15 },
  courses: { title: 'Courses', width: 10 },
  substage: {
    title: 'Substage',
    width: 10,
    note: 'Currently substages are shared among program courses. So their configuration affects all courses.',
  },
  eventName: { title: 'Event Name', width: 20 },
  startDate: { title: 'Start Date', width: 15 },
  endDate: { title: 'End Date', width: 15 },
  dayType: { title: 'Day Type', width: 10, groupTitle: GROUP_TITLES.courseEventsData },
  ordinaryClasses: {
    title: 'Ordinary Classes?',
    width: 10,
    groupTitle: GROUP_TITLES.courseEventsData,
  },
  color: { title: 'Color', width: 10, groupTitle: GROUP_TITLES.courseEventsData },
};

Object.keys(PROGRAM_EVENTS_COLUMN_DEFINITIONS).forEach((key) => {
  if (!PROGRAM_EVENTS_COLUMN_DEFINITIONS[key].style) {
    PROGRAM_EVENTS_COLUMN_DEFINITIONS[key].style = { bgColor: 'lightBlue' };
  }
});

module.exports = {
  GROUP_TITLES,
  PROGRAM_EVENTS_COLUMN_DEFINITIONS,
};

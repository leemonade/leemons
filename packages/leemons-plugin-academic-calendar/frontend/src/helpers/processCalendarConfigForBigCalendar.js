import _ from 'lodash';

export function processCalendarConfigForBigCalendar(config, { course, locale }) {
  const courseDates = config.courseDates[course];
  const courseEvents = config.courseEvents[course];
  const substagesDates = config.substagesDates[course];
  const { regionalConfig } = config;

  console.log('regionalConfig', regionalConfig);

  const events = [];
  if (courseDates) {
    events.push({
      allDay: true,
      start: new Date(courseDates.startDate),
      end: new Date(courseDates.startDate),
      originalEvent: {
        calendar: {
          desaturateColor: false,
          bgColor: '#000000',
          borderStyle: 'solid',
          borderColor: '#000000',
          rightArrow: true,
          leftArrow: false,
          zIndex: -2,
        },
      },
    });
    events.push({
      allDay: true,
      start: new Date(courseDates.endDate),
      end: new Date(courseDates.endDate),
      originalEvent: {
        calendar: {
          desaturateColor: false,
          bgColor: '#000000',
          borderStyle: 'solid',
          borderColor: '#000000',
          leftArrow: true,
          rightArrow: false,
          zIndex: -2,
        },
      },
    });
  }

  if (regionalConfig) {
    _.forEach(regionalConfig.daysOffEvents, (e) => {
      events.push({
        allDay: true,
        title: e.name,
        start: new Date(e.startDate),
        end: new Date(e.endDate || e.startDate),
        originalEvent: {
          calendar: {
            desaturateColor: false,
            bgColor: ['#F6E1F3', '#ECD8E9'],
            borderStyle: 'solid',
            borderColor: '#000000',
            rotate: -45,
            oneDayStyle: true,
            zIndex: -10,
          },
        },
      });
    });
    _.forEach(regionalConfig.localEvents, (e) => {
      events.push({
        allDay: true,
        title: e.name,
        start: new Date(e.startDate),
        end: new Date(e.endDate || e.startDate),
        originalEvent: {
          calendar: {
            bgColor: ['#E4DDF7', '#DBD4ED'],
            borderStyle: 'solid',
            borderColor: '#E4DDF7',
            leftArrow: false,
            rightArrow: false,
            rotate: 90,
            oneDayStyle: true,
            zIndex: -8,
          },
        },
      });
    });
    _.forEach(regionalConfig.regionalEvents, (e) => {
      events.push({
        allDay: true,
        title: e.name,
        start: new Date(e.startDate),
        end: new Date(e.endDate || e.startDate),
        originalEvent: {
          calendar: {
            bgColor: ['#DEEDE4', '#D5E4DB'],
            borderStyle: 'solid',
            borderColor: '#DEEDE4',
            leftArrow: false,
            rightArrow: false,
            oneDayStyle: true,
            zIndex: -6,
          },
        },
      });
    });
  }

  if (substagesDates && Object.keys(substagesDates).length) {
    _.forEach(Object.keys(substagesDates), (key) => {
      events.push({
        allDay: true,
        start: new Date(substagesDates[key].startDate),
        end: new Date(substagesDates[key].startDate),
        originalEvent: {
          calendar: {
            desaturateColor: false,
            bgColor: 'transparent',
            borderStyle: 'solid',
            borderColor: '#000000',
            leftArrow: false,
            rightArrow: true,
            zIndex: -4,
          },
        },
      });
      events.push({
        allDay: true,
        start: new Date(substagesDates[key].endDate || substagesDates[key].startDate),
        end: new Date(substagesDates[key].endDate || substagesDates[key].startDate),
        originalEvent: {
          calendar: {
            desaturateColor: false,
            bgColor: 'transparent',
            borderStyle: 'solid',
            borderColor: '#000000',
            leftArrow: true,
            rightArrow: false,
            zIndex: -4,
          },
        },
      });
    });
  }

  _.forEach(courseEvents, (event) => {
    if (event.dayType === 'schoolDays') {
      events.push({
        allDay: true,
        title: event.name,
        start: new Date(event.startDate),
        end: new Date(event.endDate || event.startDate),
        originalEvent: {
          calendar: {
            desaturateColor: false,
            bgColor: event.color,
            borderStyle: 'dashed',
            borderColor: '#000000',
            leftArrow: false,
            rightArrow: false,
            zIndex: -12,
          },
        },
      });
    } else {
      events.push({
        allDay: true,
        title: event.name,
        start: new Date(event.startDate),
        end: new Date(event.endDate || event.startDate),
        originalEvent: {
          calendar: {
            desaturateColor: false,
            bgColor: ['#F6E1F3', '#ECD8E9'],
            borderStyle: 'solid',
            borderColor: '#000000',
            rotate: -45,
            oneDayStyle: true,
            zIndex: -10,
          },
        },
      });
    }
  });

  return {
    events,
    currentView: 'monthRange',
    locale,
    defaultDate: new Date(),
    monthRange: {
      startYear: new Date(courseDates.startDate).getFullYear(),
      startMonth: new Date(courseDates.startDate).getMonth(),
      endYear: new Date(courseDates.endDate).getFullYear(),
      endMonth: new Date(courseDates.endDate).getMonth(),
    },
  };
}

import _ from 'lodash';
import React from 'react';
import { Box, ImageLoader } from '@bubbles-ui/components';
import useTranslateTitle from '@calendar/helpers/useTranslateTitle';
import ColorBall from '@academic-calendar/components/ColorBall';

function Icon({ src }) {
  return (
    <Box sx={() => ({ position: 'relative', display: 'inline-block', verticalAlign: '' })}>
      <Box sx={() => ({ position: 'relative', width: '24px', height: '24px' })}>
        <ImageLoader height="24px" src={src} />
      </Box>
    </Box>
  );
}

export function useProcessCalendarConfigForBigCalendar(trans) {
  const [translate, t, loading] = useTranslateTitle(trans);
  return [
    (config, { course, locale, forCalendar }) => {
      const courses = _.isArray(course) ? course : [course];

      let firstCourseDates = null;

      const events = [];
      _.forEach(courses, (id, index) => {
        const courseDates = config.courseDates[id];
        const courseEvents = config.courseEvents[id];
        const substagesDates = config.substagesDates[id];
        const { regionalConfig } = config;
        if (!firstCourseDates) firstCourseDates = courseDates;

        if (courseDates) {
          const cour = _.find(config.program.courses, { id });
          const courseName = cour.name ? cour.name : `${t('course')} ${cour.index}`;
          const courseNameProgram = `${courseName} - ${config.program.abbreviation}`;
          events.push({
            allDay: true,
            title: translate(`{-_start_-}: ${courseNameProgram}`),
            start: new Date(courseDates.startDate),
            end: new Date(courseDates.startDate),
            originalEvent: {
              noCanOpen: true,
              calendar: {
                icon: <Icon src="/public/academic-calendar/start-course.svg" />,
                desaturateColor: !!forCalendar,
                bgColor: forCalendar ? '#4F96FF' : '#000000',
                borderStyle: 'solid',
                borderColor: forCalendar ? '#4F96FF' : '#000000',
                rightArrow: true,
                leftArrow: false,
                zIndex: -2,
              },
            },
          });
          events.push({
            allDay: true,
            title: translate(`{-_end_-}: ${courseNameProgram}`),
            start: new Date(courseDates.endDate),
            end: new Date(courseDates.endDate),
            originalEvent: {
              noCanOpen: true,
              calendar: {
                icon: <Icon src="/public/academic-calendar/end-course.svg" />,
                desaturateColor: !!forCalendar,
                bgColor: forCalendar ? '#4F96FF' : '#000000',
                borderStyle: 'solid',
                borderColor: forCalendar ? '#4F96FF' : '#000000',
                leftArrow: true,
                rightArrow: false,
                zIndex: -2,
              },
            },
          });
        }

        if (regionalConfig) {
          if ((forCalendar && index === 0) || !forCalendar) {
            _.forEach(regionalConfig.daysOffEvents, (e) => {
              events.push({
                allDay: true,
                title: e.name,
                start: new Date(e.startDate),
                end: new Date(e.endDate || e.startDate),
                originalEvent: {
                  noCanOpen: true,
                  calendar: {
                    icon: <ColorBall colors={['#F6E1F3', '#ECD8E9']} rotate={-45} withBorder />,
                    desaturateColor: false,
                    bgColor: forCalendar ? '#ffffff' : ['#F6E1F3', '#ECD8E9'],
                    borderStyle: 'solid',
                    borderColor: forCalendar ? '#ffffff' : '#000000',
                    rotate: -45,
                    oneDayStyle: true,
                    zIndex: -6,
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
                  noCanOpen: true,
                  calendar: {
                    icon: <ColorBall colors={['#E4DDF7', '#DBD4ED']} rotate={90} withBorder />,
                    bgColor: forCalendar ? '#ffffff' : ['#E4DDF7', '#DBD4ED'],
                    borderStyle: 'solid',
                    desaturateColor: false,
                    borderColor: forCalendar ? '#ffffff' : '#E4DDF7',
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
                  noCanOpen: true,
                  calendar: {
                    icon: <ColorBall colors={['#DEEDE4', '#D5E4DB']} withBorder />,
                    bgColor: forCalendar ? '#ffffff' : ['#DEEDE4', '#D5E4DB'],
                    borderStyle: 'solid',
                    desaturateColor: false,
                    borderColor: forCalendar ? '#ffffff' : '#DEEDE4',
                    leftArrow: false,
                    rightArrow: false,
                    oneDayStyle: true,
                    zIndex: -10,
                  },
                },
              });
            });
          }
        }

        if (substagesDates && Object.keys(substagesDates).length) {
          _.forEach(Object.keys(substagesDates), (key) => {
            const substage = _.find(config.program.substages, { id: key });
            const substageName = `${substage.name} - ${config.program.abbreviation}`;
            events.push({
              allDay: true,
              title: translate(`{-_start_-}: ${substageName}`),
              start: new Date(substagesDates[key].startDate),
              end: new Date(substagesDates[key].startDate),
              originalEvent: {
                noCanOpen: true,
                calendar: {
                  icon: <Icon src="/public/academic-calendar/start-substage.svg" />,
                  desaturateColor: !!forCalendar,
                  bgColor: forCalendar ? '#4F96FF' : 'transparent',
                  borderStyle: 'solid',
                  borderColor: forCalendar ? '#4F96FF' : '#000000',
                  leftArrow: false,
                  rightArrow: true,
                  zIndex: -4,
                },
              },
            });
            events.push({
              allDay: true,
              title: translate(`{-_end_-}: ${substageName}`),
              start: new Date(substagesDates[key].endDate || substagesDates[key].startDate),
              end: new Date(substagesDates[key].endDate || substagesDates[key].startDate),
              originalEvent: {
                noCanOpen: true,
                calendar: {
                  icon: <Icon src="/public/academic-calendar/end-substage.svg" />,
                  desaturateColor: !!forCalendar,
                  bgColor: forCalendar ? '#4F96FF' : 'transparent',
                  borderStyle: 'solid',
                  borderColor: forCalendar ? '#4F96FF' : '#000000',
                  leftArrow: true,
                  rightArrow: false,
                  zIndex: -4,
                },
              },
            });
          });
        }

        if (
          !forCalendar ||
          (forCalendar && config.allCoursesHaveSameDates && index === 0) ||
          (forCalendar && !config.allCoursesHaveSameDates)
        ) {
          _.forEach(courseEvents, (event) => {
            if (event.dayType === 'schoolDays') {
              events.push({
                allDay: true,
                title: event.periodName,
                start: new Date(event.startDate),
                end: new Date(event.endDate || event.startDate),
                originalEvent: {
                  noCanOpen: true,
                  calendar: {
                    icon: <ColorBall colors={event.color} rotate={0} isSquare={true} withBorder />,
                    desaturateColor: false,
                    bgColor: event.color,
                    borderStyle: 'dashed',
                    borderColor: '#000000',
                    leftArrow: false,
                    rightArrow: false,
                    zIndex: -4,
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
                  noCanOpen: true,
                  calendar: {
                    icon: <ColorBall colors={['#F6E1F3', '#ECD8E9']} rotate={-45} withBorder />,
                    desaturateColor: false,
                    bgColor: forCalendar ? '#ffffff' : ['#F6E1F3', '#ECD8E9'],
                    borderStyle: 'solid',
                    borderColor: forCalendar ? '#ffffff' : '#000000',
                    rotate: -45,
                    oneDayStyle: true,
                    zIndex: -6,
                  },
                },
              });
            }
          });
        }
      });

      return {
        events,
        currentView: 'monthRange',
        locale,
        defaultDate: new Date(),
        monthRange: {
          startYear: new Date(firstCourseDates.startDate).getFullYear(),
          startMonth: new Date(firstCourseDates.startDate).getMonth(),
          endYear: new Date(firstCourseDates.endDate).getFullYear(),
          endMonth: new Date(firstCourseDates.endDate).getMonth(),
        },
      };
    },
    loading,
  ];
}

export default useProcessCalendarConfigForBigCalendar;

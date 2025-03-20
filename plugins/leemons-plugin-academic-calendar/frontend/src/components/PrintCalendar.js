import { forwardRef } from 'react';

import { BigCalendar } from '@bubbles-ui/calendars';
import { Stack, Box, Title } from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import PropTypes from 'prop-types';

import Calendar from './Calendar';

import CalendarKey from '@academic-calendar/components/CalendarKey';
import prefixPN from '@academic-calendar/helpers/prefixPN';

const PrintCalendar = forwardRef(
  ({ programName, calendarConf, config, course, useAcademicCalendar }, ref) => {
    const [t] = useTranslateLoader(prefixPN('programList'));

    const courseId = course?.id ?? course;
    const courseDates = config.courseDates[courseId] ?? {};

    // Handle year display based on course dates
    let yearDisplay = '';
    let courseIndex = '';

    if (!course?.index && courseDates?.startDate && courseDates?.endDate) {
      // Get the years from start and end dates
      const startYear = new Date(courseDates.startDate).getFullYear();
      const endYear = new Date(courseDates.endDate).getFullYear();

      // Format the course index based on whether the years are different
      yearDisplay = startYear === endYear ? `${startYear}` : `${startYear} - ${endYear}`;
    }

    // Set course index with year display if available, otherwise just use the index
    courseIndex = course?.index ?? yearDisplay;

    return (
      <Box style={{ display: 'none' }}>
        <Stack
          direction="column"
          alignItems="center"
          height="100%"
          id="calendarToPrint"
          style={{
            width: '210mm',
            minHeight: '297mm',
          }}
          ref={ref}
        >
          <Box style={{ marginTop: 16 }}>
            <Title order={2}>{`${t('calendarOf')} ${programName} - ${
              config.allCoursesHaveSameDates ? t('allCourses') : `${t('course')} ${courseIndex}`
            }`}</Title>
          </Box>
          <Box style={{ marginTop: 32 }}>
            {useAcademicCalendar ? (
              <Calendar config={config} course={course} printMode />
            ) : (
              <BigCalendar {...calendarConf} printMode />
            )}
          </Box>
          <Box
            sx={(theme) => ({
              marginTop: theme.spacing.xl,
              width: '100%',
              padding: 16,
              paddingTop: 0,
            })}
          >
            <CalendarKey />
          </Box>
        </Stack>
      </Box>
    );
  }
);

PrintCalendar.displayName = 'PrintCalendar';
PrintCalendar.propTypes = {
  programName: PropTypes.string,
  calendarConf: PropTypes.any,
  config: PropTypes.any,
  course: PropTypes.any,
  printMode: PropTypes.bool,
  t: PropTypes.func,
  useAcademicCalendar: PropTypes.bool,
};

export default PrintCalendar;

import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { BigCalendar } from '@bubbles-ui/calendars';
import { Stack, Box, Title } from '@bubbles-ui/components';
import CalendarKey from '@academic-calendar/components/CalendarKey';

const PrintCalendar = forwardRef(({ programName, calendarConf, config, course, t }, ref) => (
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
          config.allCoursesHaveSameDates ? t('allCourses') : `${t('course')} ${course.index}`
        }`}</Title>
      </Box>
      <Box style={{ marginTop: 32 }}>
        <BigCalendar {...calendarConf} printMode />
      </Box>
      <Box style={{ width: '100%', padding: 16, paddingTop: 0 }}>
        <CalendarKey />
      </Box>
    </Stack>
  </Box>
));

PrintCalendar.displayName = 'PrintCalendar';
PrintCalendar.propTypes = {
  programName: PropTypes.string,
  calendarConf: PropTypes.any,
  config: PropTypes.any,
  course: PropTypes.any,
  printMode: PropTypes.bool,
  t: PropTypes.func,
};

export default PrintCalendar;

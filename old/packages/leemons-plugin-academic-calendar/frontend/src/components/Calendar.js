import { useProcessCalendarConfigForBigCalendar } from '@academic-calendar/helpers/useProcessCalendarConfigForBigCalendar';
import { BigCalendar } from '@bubbles-ui/calendars';
import { useLocale } from '@common';
import PropTypes from 'prop-types';
import React from 'react';

export default function Calendar({ config, course, printMode }) {
  const locale = useLocale();

  const [processCalendarConfigForBigCalendar] = useProcessCalendarConfigForBigCalendar();

  const bigCalendarConf = processCalendarConfigForBigCalendar(
    {
      ...config,
      regionalConfig: config.regionalConfig,
    },
    {
      course,
      locale,
    }
  );

  return <BigCalendar {...bigCalendarConf} printMode={printMode} />;
}

Calendar.propTypes = {
  config: PropTypes.any,
  course: PropTypes.any,
  printMode: PropTypes.bool,
};

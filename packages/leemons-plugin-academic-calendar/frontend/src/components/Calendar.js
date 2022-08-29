import React from 'react';
import PropTypes from 'prop-types';
import { BigCalendar } from '@bubbles-ui/calendars';
import { useLocale } from '@common';
import { useProcessCalendarConfigForBigCalendar } from '@academic-calendar/helpers/useProcessCalendarConfigForBigCalendar';

export default function Calendar({ config, course }) {
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

  return <BigCalendar {...bigCalendarConf} />;
}

Calendar.propTypes = {
  config: PropTypes.any,
  course: PropTypes.any,
};

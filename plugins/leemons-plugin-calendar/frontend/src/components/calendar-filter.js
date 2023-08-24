import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from '@bubbles-ui/components';
import getCalendarNameWithConfigAndSession from '../helpers/getCalendarNameWithConfigAndSession';

export function CalendarFilter({ calendar, session, config, showEventsChange = () => {} }) {
  return (
    <Checkbox
      label={getCalendarNameWithConfigAndSession(calendar, config, session)}
      checked={calendar.showEvents}
      onChange={showEventsChange}
    />
  );
}

export default CalendarFilter;

CalendarFilter.propTypes = {
  calendar: PropTypes.object,
  session: PropTypes.object,
  config: PropTypes.object,
  showEventsChange: PropTypes.func,
};

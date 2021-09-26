import PropTypes from 'prop-types';
import { Checkbox, FormControl } from 'leemons-ui';
import getCalendarNameWithConfigAndSession from '../helpers/getCalendarNameWithConfigAndSession';

export function CalendarFilter({ calendar, session, config, showEventsChange = () => {} }) {
  return (
    <div>
      <FormControl
        label={getCalendarNameWithConfigAndSession(calendar, config, session)}
        labelPosition="right"
      >
        <Checkbox checked={calendar.showEvents} onChange={showEventsChange} />
      </FormControl>
    </div>
  );
}

CalendarFilter.propTypes = {
  calendar: PropTypes.object,
  session: PropTypes.object,
  config: PropTypes.object,
  showEventsChange: PropTypes.func,
};

import PropTypes from 'prop-types';
import { Checkbox, FormControl } from 'leemons-ui';

export function CalendarFilter({ calendar, session, config, showEventsChange = () => {} }) {
  let label = calendar.name;
  if (config && config.userCalendar && config.userCalendar.id === calendar.id)
    label = session.name + (session.surnames || '');

  return (
    <div>
      <FormControl label={label} labelPosition="right">
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

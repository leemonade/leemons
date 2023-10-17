import * as _ from 'lodash';
import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import { Avatar, Paper } from '@bubbles-ui/components';
import moment from 'moment';
import getCalendarNameWithConfigAndSession from '../helpers/getCalendarNameWithConfigAndSession';

export default function KanbanCard({
  event,
  removeCard,
  dragging,
  config,
  session,
  columns,
  onClick = () => {},
}) {
  const { isDone, isArchived } = useMemo(
    () => _.find(columns, { id: event.data.column }),
    [event, columns]
  );

  const percentaje = useMemo(() => {
    if (event.data && event.data.subtask) {
      const total = event.data.subtask.length;
      const completed = _.filter(event.data.subtask, { checked: true }).length;
      return (completed / total) * 100;
    }
    return null;
  }, [event]);

  const calendar = _.find(config.calendars, { id: event.calendar });
  if (!calendar) return null;

  const style = {};
  const className = ['m-2', 'text-secondary'];

  if (calendar.borderColor) {
    style.borderColor = calendar.borderColor;
    className.push('ring');
  }
  if (calendar.bgColor) {
    style.backgroundColor = calendar.bgColor;
  }

  let avatarType = 'initials';
  if (calendar.icon) {
    avatarType = 'icon';
  }
  if (config.userCalendar && config.userCalendar.id === calendar.id) {
    avatarType = 'avatar';
  }
  return (
    <Paper shadow="level03" dragging={dragging.toString()} onClick={() => onClick(event)}>
      <div>{event.title}</div>
      <div>{moment.utc(event.endDate).format('DD-MM-YYYY')}</div>
      {event.data && event.data.description ? <div>{event.data.description}</div> : null}
      <div>
        <Avatar
          fullName={calendar.name}
          image="https://daisyui.com/tailwind-css-component-profile-1@40w.png"
          style={style}
        />
        {avatarType === 'avatar'
          ? getCalendarNameWithConfigAndSession(calendar, config, session)
          : null}
      </div>
      {percentaje !== null ? <div>{percentaje.toFixed(2)}%</div> : null}
    </Paper>
  );
}

KanbanCard.propTypes = {
  event: PropTypes.object,
  removeCard: PropTypes.func,
  dragging: PropTypes.any,
  config: PropTypes.object,
  session: PropTypes.object,
  columns: PropTypes.array,
  onClick: PropTypes.func,
};

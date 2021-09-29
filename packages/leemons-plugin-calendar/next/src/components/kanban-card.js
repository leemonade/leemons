import * as _ from 'lodash';
import PropTypes from 'prop-types';
import moment from 'moment';
import { useMemo } from 'react';
import { Avatar, Card } from 'leemons-ui';
import getCalendarNameWithConfigAndSession from '../helpers/getCalendarNameWithConfigAndSession';

export default function KanbanCard({
  event,
  removeCard,
  dragging,
  config,
  session,
  onClick = () => {},
}) {
  const calendar = _.find(config.calendars, { id: event.calendar });

  if (!calendar) return null;

  const percentaje = useMemo(() => {
    if (event.data && event.data.subtask) {
      const total = event.data.subtask.length;
      const completed = _.filter(event.data.subtask, { checked: true }).length;
      return (completed / total) * 100;
    }
    return null;
  }, [event]);

  const getInitials = () => {
    const words = calendar.name.split(' ');
    return (
      <span>
        {words[0] ? words[0][0] : ''}
        {words[1] ? words[1][0] : ''}
      </span>
    );
  };

  const getIcon = () => <div>icono</div>;

  const getAvatar = () => <img src="http://daisyui.com/tailwind-css-component-profile-1@40w.png" />;

  const style = {};
  const className = ['m-2', 'text-secondary'];

  if (calendar.borderColor) {
    style.borderColor = calendar.borderColor;
    className.push('ring');
  }
  if (calendar.bgColor) {
    style.backgroundColor = calendar.bgColor;
  }

  let avatarContent = getInitials();
  let avatarType = 'initials';
  if (calendar.icon) {
    avatarType = 'icon';
    avatarContent = getIcon();
  }
  if (config.userCalendar && config.userCalendar.id === calendar.id) {
    avatarType = 'avatar';
    avatarContent = getAvatar();
  }

  return (
    <Card
      className="shadow p-4 mt-2 mb-2 bg-white"
      dragging={dragging}
      onClick={() => onClick(event)}
    >
      <div>{event.title}</div>
      <div>{moment.utc(event.endDate).format('DD-MM-YYYY')}</div>
      {event.data && event.data.description ? <div>{event.data.description}</div> : null}
      <div>
        <Avatar
          type={avatarType === 'initials' ? 'placeholder' : null}
          circle={true}
          size={6}
          style={style}
          className={className.join(' ')}
        >
          {avatarContent}
        </Avatar>
        {avatarType === 'avatar'
          ? getCalendarNameWithConfigAndSession(calendar, config, session)
          : null}
      </div>
      {percentaje !== null ? <div>{percentaje.toFixed(2)}%</div> : null}
    </Card>
  );
}

KanbanCard.propTypes = {
  event: PropTypes.object,
  removeCard: PropTypes.func,
  dragging: PropTypes.any,
  config: PropTypes.object,
  session: PropTypes.object,
  onClick: PropTypes.func,
};

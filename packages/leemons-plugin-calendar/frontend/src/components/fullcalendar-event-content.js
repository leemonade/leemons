import React from 'react';
import PropTypes from 'prop-types';
import { Avatar } from 'leemons-ui';

export function FullCalendarEventContent({ info, config }) {
  const event = info.event.extendedProps.originalEvent;

  const getInitials = () => {
    const words = event.calendar.name.split(' ');
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

  if (event.calendar.borderColor) {
    style.borderColor = event.calendar.borderColor;
    className.push('ring');
  }
  if (event.calendar.bgColor) {
    style.backgroundColor = event.calendar.bgColor;
  }

  let avatarContent = getInitials();
  let avatarType = 'initials';
  if (event.calendar.icon) {
    avatarType = 'icon';
    avatarContent = getIcon();
  }
  if (config && config.userCalendar && config.userCalendar.id === event.calendar.id) {
    avatarType = 'avatar';
    avatarContent = getAvatar();
  }

  return (
    <div className="flex items-center">
      <Avatar
        type={avatarType === 'initials' ? 'placeholder' : null}
        circle={true}
        size={6}
        style={style}
        className={className.join(' ')}
      >
        {avatarContent}
      </Avatar>
      <div className="overflow-hidden overflow-ellipsis">{event.title}</div>
    </div>
  );
}

FullCalendarEventContent.propTypes = {
  info: PropTypes.object,
  config: PropTypes.object,
};

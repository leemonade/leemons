import React from 'react';
import PropTypes from 'prop-types';
import { Avatar } from '@bubbles-ui/components';

export function FullCalendarEventContent({ info }) {
  const event = info.event.extendedProps.originalEvent;

  const style = {};

  if (event.calendar.bgColor) {
    style.backgroundColor = event.calendar.bgColor;
  }

  return (
    <div className="flex items-center">
      <Avatar
        fullName={event.calendar.name}
        image="https://daisyui.com/tailwind-css-component-profile-1@40w.png"
        style={style}
      />
      <div className="overflow-hidden overflow-ellipsis">{event.title}</div>
    </div>
  );
}

export default FullCalendarEventContent;

FullCalendarEventContent.propTypes = {
  info: PropTypes.object,
  config: PropTypes.object,
};

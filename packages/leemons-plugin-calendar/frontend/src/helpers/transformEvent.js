import { cloneDeep, keyBy } from 'lodash';

export default function transformEvent(_event, calendars) {
  const event = cloneDeep(_event);
  if (event.type === 'plugins.calendar.task' && event.data && event.data.classes) {
    const calendarsByKey = keyBy(calendars, 'id');
    if (event.data.classes.length >= 2) {
      event.icon = '/public/assets/svgs/calendar.svg';
      event.bgColor = '#ef9760';
      event.borderColor = '#ef9760';
    } else {
      const calendar = calendarsByKey[event.data.classes[0]];
      event.icon = calendar.icon;
      event.bgColor = calendar.bgColor;
      event.borderColor = calendar.borderColor;
    }
  }
  return event;
}

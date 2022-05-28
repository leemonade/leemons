import { cloneDeep, keyBy, uniq } from 'lodash';

export default function transformEvent(_event, calendars) {
  const event = cloneDeep(_event);
  if (event.type === 'plugins.calendar.task' && event.data && event.data.classes) {
    const calendarsByKey = keyBy(calendars, 'id');
    let classes = event.data.classes ? cloneDeep(event.data.classes) : [];
    classes.push(event.calendar);
    classes = uniq(classes);
    if (classes.length >= 2) {
      event.icon = '/public/assets/svgs/module-three.svg';
      event.bgColor = '#67728E';
      event.borderColor = '#67728E';
      event.calendarName = 'Multi-Subject';
    } else {
      const calendar = calendarsByKey[classes[0]];
      event.icon = calendar.icon;
      event.bgColor = calendar.bgColor;
      event.borderColor = calendar.borderColor;
      event.calendarName = calendar.name;
    }
  }
  return event;
}

import { cloneDeep, keyBy, uniq } from 'lodash';

export default function transformEvent(_event, calendars, t) {
  const event = cloneDeep(_event);
  // if (event.type === 'plugins.calendar.task' && event.data && event.data.classes) {
  const calendarsByKey = keyBy(calendars, 'id');
  let classes = event.data?.classes ? cloneDeep(event.data.classes) : [];
  if (calendarsByKey[event.calendar]?.key.indexOf('plugins.calendar.class.') >= 0) {
    classes.push(event.calendar);
  }
  classes = uniq(classes);
  if (classes.length >= 2) {
    event.icon = '/public/assets/svgs/module-three.svg';
    event.bgColor = '#67728E';
    event.borderColor = '#67728E';
    event.calendarName = t ? t('multiSubject') : 'Multi-Subject';
  } else {
    let calendar = calendarsByKey[classes[0]];
    if (!calendar) {
      calendar = calendarsByKey[event.calendar];
    }
    event.icon = calendar.icon;
    event.bgColor = calendar.bgColor;
    event.borderColor = calendar.borderColor;
    event.calendarName = calendar.name;
    if (!event.icon && !calendar.isClass && !calendar.isUserCalendar) {
      event.icon = '/public/assets/svgs/alarm-bell.svg';
    }
  }
  // }
  return event;
}

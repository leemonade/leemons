import { cloneDeep, find, keyBy, uniq } from 'lodash';
import { parseDeadline } from '@assignables/components/NYACard/NYACard';

export default function transformEvent(_event, calendars, { columns, isTeacher, t, translate }) {
  const event = cloneDeep(_event);
  // if (event.type === 'plugins.calendar.task' && event.data && event.data.classes) {
  const calendarsByKey = keyBy(calendars, 'id');
  let classes = event.data?.classes ? cloneDeep(event.data.classes) : [];
  if (calendarsByKey[event.calendar]?.key.indexOf('plugins.calendar.class.') >= 0) {
    classes.push(event.calendar);
  }
  classes = uniq(classes);
  event.uniqClasses = classes;
  if (classes.length >= 2) {
    const calendar = calendarsByKey[event.calendar];
    if (calendar.isUserCalendar) {
      event.image = calendar.image;
      event.calendarName = null;
    }
    event.icon = '/public/assets/svgs/module-three.svg';
    event.bgColor = '#67728E';
    event.borderColor = '#67728E';
    event.calendarName = t ? t('multiSubject') : 'Multi-Subject';
  } else {
    let calendar = calendarsByKey[classes[0]];
    if (!calendar) {
      calendar = calendarsByKey[event.calendar];
    }
    event.icon = event.icon || calendar.icon;
    event.bgColor = event.bgColor || calendar.bgColor;
    event.borderColor = event.borderColor || calendar.borderColor;
    event.calendarName = calendar.name.replace(/(\(-auto-\))/g, '');
    if (calendar.isUserCalendar && !classes.length) {
      event.image = calendar.image;
      event.calendarName = null;
    }
    if (!event.icon && !calendar.isClass && !calendar.isUserCalendar) {
      event.icon = '/public/assets/svgs/alarm-bell.svg';
    }
  }
  event.title = translate(event.title);

  const column = find(columns, { id: event?.data?.column });

  if (column && column.order <= 3) {
    if (event.startDate && event.endDate) {
      const instance = {
        dates: {
          deadline: event.endDate,
          start: event.startDate,
        },
        status: null,
      };
      event.deadline = parseDeadline(isTeacher, isTeacher ? instance : { instance });
    }
  }

  // }

  return event;
}

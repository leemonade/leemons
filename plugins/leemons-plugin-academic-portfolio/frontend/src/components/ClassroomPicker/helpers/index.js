import { capitalize } from 'lodash';

function convertTimeToMinutes(time) {
  if (!time) return 0;
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

function checkCollision(schedule1, schedule2) {
  const dayMatch = schedule1.day === schedule2.day;
  const start1 = convertTimeToMinutes(schedule1.start);
  const end1 = convertTimeToMinutes(schedule1.end);
  const start2 = convertTimeToMinutes(schedule2.start);
  const end2 = convertTimeToMinutes(schedule2.end);
  const timeOverlap = start1 < end2 && end1 > start2;

  return dayMatch && timeOverlap;
}

const localeWeekDaysCache = {};

function getLocaleWeekDays(locale = 'en') {
  if (localeWeekDaysCache[locale]) {
    return localeWeekDaysCache[locale];
  }

  const localeDays = [...Array(7).keys()].map((dayIndex) =>
    new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(
      new Date(Date.UTC(2021, 5, dayIndex + 6))
    )
  );
  const weekDays = localeDays.map((day) => day.toLowerCase());
  const weekDaysAbbreviations = weekDays.reduce((acc, day, i) => {
    acc[day] = capitalize(day.substring(0, 2));
    return acc;
  }, {});

  const result = { weekDays, weekDaysAbbreviations };
  localeWeekDaysCache[locale] = result;

  return result;
}

function getScheduleMap(schedule, weekDaysLocalized, locale = 'en') {
  let weekDays = weekDaysLocalized;

  if (!weekDays) {
    const locales = getLocaleWeekDays(locale);
    weekDays = locales.weekDays;
  }

  return schedule.reduce((acc, { dayWeek, start, end }) => {
    const key = `${start}-${end}`;
    const dayName = weekDays[dayWeek];
    if (!acc[key]) {
      acc[key] = [dayName];
    } else {
      acc[key].push(dayName);
    }
    return acc;
  }, {});
}

function getScheduleArray(
  schedule,
  weekDaysLocalized,
  weekDaysAbbreviationsLocalized,
  locale = 'en'
) {
  const weekDays = weekDaysLocalized || getLocaleWeekDays(locale).weekDays;
  const weekDaysAbbreviations =
    weekDaysAbbreviationsLocalized || getLocaleWeekDays(locale).weekDaysAbbreviations;

  const scheduleMap = getScheduleMap(schedule, weekDays, locale);

  const formatDaysString = (tempArray) => {
    if (tempArray.length > 1) {
      return `${tempArray[0]} - ${tempArray[tempArray.length - 1]}`;
    }
    return `${tempArray[0]}`;
  };

  return Object.entries(scheduleMap).map(([key, days]) => {
    const [start, end] = key.split('-');
    const sortedDays = days.sort((a, b) => weekDays.indexOf(a) - weekDays.indexOf(b));
    const daysAbbreviated = sortedDays.map((day) => weekDaysAbbreviations[day]);

    let daysStr = '';
    let lastDayIndex = -2;
    let tempArray = [];

    daysAbbreviated.forEach((day, i) => {
      const currentIndex = weekDays.indexOf(sortedDays[i]);
      if (lastDayIndex + 1 === currentIndex) {
        tempArray.push(day);
      } else {
        if (tempArray.length) {
          daysStr = `${daysStr}${formatDaysString(tempArray)}, `;
        }
        tempArray = [day];
      }
      lastDayIndex = currentIndex;
    });

    if (tempArray.length) {
      daysStr += formatDaysString(tempArray);
    }

    daysStr = daysStr.endsWith(', ') ? daysStr.slice(0, -2) : daysStr;

    return `${daysStr}, ${start}-${end}`;
  });
}

const transformData = (dataClasses, locale = 'en') => {
  let hasCollisions = false;
  const { weekDays, weekDaysAbbreviations } = getLocaleWeekDays(locale);

  const getCollisions = (array, item, index) =>
    array.reduce((acc, currentItem, currentIndex) => {
      if (index !== currentIndex) {
        item.schedule.forEach((itemSchedule) => {
          currentItem.schedule.forEach((currentItemSchedule) => {
            if (checkCollision(itemSchedule, currentItemSchedule)) {
              hasCollisions = true;
              acc.push(currentItem.id);
            }
          });
        });
      }
      return acc;
    }, []);

  const data = dataClasses.map((item, index, array) => {
    const collideWith = getCollisions(array, item, index);
    const scheduleArray = getScheduleArray(item.schedule, weekDays, weekDaysAbbreviations, locale);

    return {
      value: item?.id,
      label: item?.subject?.name,
      subjectName: item?.subject?.name,
      subjectColor: item?.subject?.color,
      subjectIcon: item?.subject?.icon,
      schedule: scheduleArray,
      collideWith,
    };
  });

  return { data, hasCollisions };
};

export { transformData, getLocaleWeekDays, getScheduleArray };

/* eslint-disable import/prefer-default-export */

const datesAreOnSameDay = (first, second) =>
  first.getFullYear() === second.getFullYear() &&
  first.getMonth() === second.getMonth() &&
  first.getDate() === second.getDate();

const getOnlyHours = (date) => {
  const hour = date.getHours();
  const minute = date.getMinutes();

  return `${hour < 10 ? `0${hour}` : hour}:${minute < 10 ? `0${minute}` : minute}`;
};

export function getSessionDateString(
  session,
  locale,
  { onlyHours = false, onlyDate = false } = {}
) {
  let start = new Date(session.start);
  let end = new Date(session.end);
  const timeDiff = start.getTimezoneOffset() * 60000;
  start = new Date(start.valueOf() + timeDiff);
  end = new Date(end.valueOf() + timeDiff);

  if (onlyHours) {
    return `${getOnlyHours(start)} - ${getOnlyHours(end)}`;
  }

  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  };

  if (onlyDate) {
    delete options.hour;
    delete options.minute;
    return start.toLocaleDateString(locale, options);
  }
  return `${start.toLocaleDateString(locale, options)} - ${
    datesAreOnSameDay(start, end) ? getOnlyHours(end) : end.toLocaleDateString(locale, options)
  }`;
}

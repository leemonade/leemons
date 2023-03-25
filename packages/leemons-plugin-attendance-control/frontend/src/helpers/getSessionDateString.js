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

export function getSessionDateString(session, locale) {
  const start = new Date(session.start);
  const end = new Date(session.end);
  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  };
  return `${start.toLocaleDateString(locale, options)} - ${
    datesAreOnSameDay(start, end) ? getOnlyHours(end) : end.toLocaleDateString(locale, options)
  }`;
}

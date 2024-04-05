import { padStart } from 'lodash';

export function millisecondsToTime(milliseconds) {
  const seconds = Math.trunc(milliseconds / 1000) % 60;
  const minutes = Math.trunc(milliseconds / 1000 / 60) % 60;
  const hours = Math.trunc(milliseconds / 1000 / 60 / 60);

  if (hours > 0) {
    return `${padStart(hours, 2, '0')}h ${padStart(minutes, 2, '0')}m ${padStart(
      seconds,
      2,
      '0'
    )}s`;
  }

  return `${padStart(minutes, 2, '0')}m ${padStart(seconds, 2, '0')}s`;
}

export default millisecondsToTime;

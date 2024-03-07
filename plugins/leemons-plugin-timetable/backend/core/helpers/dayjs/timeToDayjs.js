const dayjs = require('dayjs');

/**
 * Converts a time string to a dayjs object.
 *
 * If the time string is not a valid time, it will return null
 */
module.exports = function timeToDayjs(time) {
  const [hours, minutes] = time.split(':');
  const timeObj = dayjs().hour(hours).minute(minutes);
  if (timeObj.isValid()) {
    return timeObj;
  }
  return null;
};

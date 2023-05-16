const weekDays = require('./weekDays');

module.exports = function validateDay(days) {
  // Check if day is an array
  if (Array.isArray(days)) {
    return days.every((day) => weekDays.includes(day));
  }

  // Check if day is a string
  if (typeof days === 'string') {
    return weekDays.includes(days);
  }

  return false;
};

const getWeekdays = require('./getWeekdays');

const WEEK_DAYS = getWeekdays();

console.log('-- WEEK_DAYS : HELPER --');
console.dir(WEEK_DAYS, { depth: null });

module.exports = WEEK_DAYS;

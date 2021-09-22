const table = {
  calendars: leemons.query('plugins_calendar::calendars'),
  events: leemons.query('plugins_calendar::events'),
  notifications: leemons.query('plugins_calendar::notifications'),
};

module.exports = { table };

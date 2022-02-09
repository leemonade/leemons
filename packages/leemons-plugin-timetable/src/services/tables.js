const table = {
  timetable: leemons.query('plugins_timetable::timetable'),
  settings: leemons.query('plugins_timetable::settings'),
};

module.exports = { table };

const tables = {
  session: leemons.query('plugins_attendance-control::session'),
  assistance: leemons.query('plugins_attendance-control::assistance'),
};

module.exports = { tables };

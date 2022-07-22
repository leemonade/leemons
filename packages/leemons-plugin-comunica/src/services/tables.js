const table = {
  room: leemons.query('plugins_comunica::room'),
  message: leemons.query('plugins_comunica::message'),
  userAgentInRoom: leemons.query('plugins_comunica::userAgentInRoom'),
};

module.exports = {table};

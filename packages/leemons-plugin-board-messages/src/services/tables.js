const table = {
  messageConfig: leemons.query('plugins_board-messages::message-config'),
  messageConfigPrograms: leemons.query('plugins_board-messages::message-config-programs'),
};

module.exports = { table };

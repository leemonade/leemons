const table = {
  settings: leemons.query('plugins_admin::settings'),
  theme: leemons.query('plugins_admin::theme'),
};

module.exports = { table };

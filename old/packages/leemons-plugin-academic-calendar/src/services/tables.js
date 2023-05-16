const table = {
  config: leemons.query('plugins_academic-calendar::config'),
  regionalConfig: leemons.query('plugins_academic-calendar::regional-config'),
};

module.exports = { table };

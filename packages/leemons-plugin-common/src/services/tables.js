const table = {
  tags: leemons.query('plugins_common::tags'),
  versions: leemons.query('plugins_tasks::versions'),
  currentVersions: leemons.query('plugins_tasks::currentVersions'),
};

module.exports = { table };

const table = {
  tags: leemons.query('plugins_common::tags'),
  versions: leemons.query('plugins_common::versions'),
  currentVersions: leemons.query('plugins_common::currentVersions'),
};

module.exports = { table };

const table = {
  treeLevel: leemons.query('plugins_subjects::tree-level'),
  settings: leemons.query('plugins_subjects::settings'),
};

module.exports = { table };

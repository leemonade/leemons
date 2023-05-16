const table = {
  curriculums: leemons.query('plugins_curriculum::curriculums'),
  nodeLevels: leemons.query('plugins_curriculum::node-levels'),
  configs: leemons.query('plugins_curriculum::configs'),
  nodes: leemons.query('plugins_curriculum::nodes'),
};

module.exports = { table };

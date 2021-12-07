const table = {
  curriculums: leemons.query('plugins_curriculum::curriculums'),
  nodeLevels: leemons.query('plugins_curriculum::node-levels'),
  nodes: leemons.query('plugins_curriculum::nodes'),
};

module.exports = { table };

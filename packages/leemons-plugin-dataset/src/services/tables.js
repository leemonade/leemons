const table = {
  dataset: leemons.query('plugins_dataset::dataset'),
  datafield: leemons.query('plugins_dataset::datafield'),
};

module.exports = { table };

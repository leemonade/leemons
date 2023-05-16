const table = {
  dataset: leemons.query('plugins_dataset::dataset'),
  datasetValues: leemons.query('plugins_dataset::dataset-values'),
};

module.exports = { table };

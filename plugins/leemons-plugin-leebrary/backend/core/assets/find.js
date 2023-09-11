async function find(query, { columns, transacting } = {}) {
  return tables.assets.find(query, { columns, transacting });
}

module.exports = { find };

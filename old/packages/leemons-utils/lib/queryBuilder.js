// build general queries and then call connector query builder
function buildQuery(model, filters = {}, ...rest) {
  return leemons.db.connectors
    .getFromConnection(model.connection)
    .buildQuery(model, filters, ...rest);
}

module.exports = buildQuery;

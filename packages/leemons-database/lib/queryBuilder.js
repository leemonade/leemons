function queryBuilder(model, connector) {
  const query = connector.query(model, connector);
  // TODO: Upgrade the query system (standardize)
  return {
    create: query.create,
    update: query.update,
    deleteOne: query.deleteOne,
    find: query.find,
    findOne: query.findOne,
    count: query.count,
  };
}

module.exports = queryBuilder;

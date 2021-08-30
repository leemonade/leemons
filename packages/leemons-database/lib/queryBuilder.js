const _ = require('lodash');

function replaceIdByPrimaryKey(params, model) {
  if (Array.isArray(params)) {
    return params.map((paramsElement) => replaceIdByPrimaryKey(paramsElement, model));
  }
  const newParams = { ...params };

  // Replace the id by the primary key
  if (_.has(newParams, 'id')) {
    delete newParams.id;
    newParams[model.schema.primaryKey.name] = params.id;
  }
  return newParams;
}

function createQuery({ query, model, connectorQuery }) {
  return (params, ...rest) => {
    const newParams = replaceIdByPrimaryKey(params, model);
    return connectorQuery[query](newParams, ...rest);
  };
}
function queryBuilder(model, connector) {
  const connectorQuery = connector.query(model, connector);
  const queryObj = {
    create: createQuery({ query: 'create', model, connectorQuery }),
    createMany: createQuery({ query: 'createMany', model, connectorQuery }),
    update: createQuery({ query: 'update', model, connectorQuery }),
    updateMany: createQuery({ query: 'updateMany', model, connectorQuery }),
    set: createQuery({ query: 'set', model, connectorQuery }),
    setMany: createQuery({ query: 'setMany', model, connectorQuery }),
    find: createQuery({ query: 'find', model, connectorQuery }),
    findOne: createQuery({ query: 'findOne', model, connectorQuery }),
    search: createQuery({ query: 'search', model, connectorQuery }),
    count: createQuery({ query: 'count', model, connectorQuery }),
    delete: createQuery({ query: 'delete', model, connectorQuery }),
    deleteMany: createQuery({ query: 'deleteMany', model, connectorQuery }),
    transaction: connectorQuery.transaction,
  };
  return queryObj;
}

module.exports = queryBuilder;

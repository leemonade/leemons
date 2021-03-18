const _ = require('lodash');

function replaceIdByPrimaryKey(params, model) {
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
  // TODO: standardize
  return {
    create: createQuery({ query: 'create', model, connectorQuery }),
    update: createQuery({ query: 'update', model, connectorQuery }),
    delete: createQuery({ query: 'delete', model, connectorQuery }),
    find: createQuery({ query: 'find', model, connectorQuery }),
    findOne: createQuery({ query: 'findOne', model, connectorQuery }),
    count: createQuery({ query: 'count', model, connectorQuery }),
  };
}

module.exports = queryBuilder;

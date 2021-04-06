const { getStackTrace } = require('leemons-utils');
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
    find: createQuery({ query: 'find', model, connectorQuery }),
    findOne: createQuery({ query: 'findOne', model, connectorQuery }),
    count: createQuery({ query: 'count', model, connectorQuery }),
    transaction: connectorQuery.transaction,
  };

  Object.defineProperty(queryObj, 'delete', {
    get: () => {
      const owner = _.get(leemons, model.target, null);
      if (owner) {
        const dir = owner.dir.app;
        const caller = getStackTrace(2);

        if (caller.fileName.startsWith(dir)) {
          return createQuery({ query: 'delete', model, connectorQuery });
        }
      }
      return () => Promise.reject(new Error(`You don't have access to delete on this model`));
    },
  });
  Object.defineProperty(queryObj, 'deleteMany', {
    get: () => {
      const owner = _.get(leemons, model.target, null);
      if (owner) {
        const dir = owner.dir.app;
        const caller = getStackTrace(2);

        if (caller.fileName.startsWith(dir)) {
          return createQuery({ query: 'deleteMany', model, connectorQuery });
        }
      }
      return () => Promise.reject(new Error(`You don't have access to deleteMany on this model`));
    },
  });
  return queryObj;
}

module.exports = queryBuilder;

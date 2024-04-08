const Queries = require('./Queries');

module.exports = function queries(client, { isCluster }) {
  return (pluginName) => {
    const queriesInstance = new Queries({ client, isCluster, pluginName });

    // Pick only public methods keeping reference to class
    return [
      'get',
      'set',
      'has',
      'delete',
      'getMany',
      'setMany',
      'hasMany',
      'deleteMany',
      'deleteByNamespace',
      'registerNamespace',
    ].reduce((acc, key) => {
      acc[key] = queriesInstance[key].bind(queriesInstance);
      return acc;
    }, {});
  };
};

const xapi = require('../src/services/xapi');

module.exports = {
  addStatement: xapi.statement.add,
  addLearningStatement(statement, config) {
    return xapi.statement.add({ ...statement, type: 'learning' }, config);
  },
  addLogStatement(statement, config) {
    return xapi.statement.add({ ...statement, type: 'log' }, config);
  },
};

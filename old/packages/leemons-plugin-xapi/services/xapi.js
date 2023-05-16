const xapi = require('../src/services/xapi');
const { Verbs } = require('../frontend/src/helpers/Verbs');
const { tables } = require('../src/services/tables');

module.exports = {
  Verbs: new Verbs(),
  find: tables.statement.find,
  addStatement: xapi.statement.add,
  addLearningStatement(statement, config) {
    return xapi.statement.add({ ...statement, type: 'learning' }, config);
  },
  addLogStatement(statement, config) {
    return xapi.statement.add({ ...statement, type: 'log' }, config);
  },
};

const _ = require('lodash');

async function getUserAgentNotesForSubjects(userAgentId, subjectIds, { transacting } = {}) {
  // TODO Integrar con el plugin que devuelva las notas
  // ES: Simulamos la devolucion de notas
  const result = {};
  _.forEach(subjectIds, (subjectId) => {
    result[subjectId] = _.random(0, 10, true);
  });
  return result;
}

module.exports = { getUserAgentNotesForSubjects };

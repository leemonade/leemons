const { filter } = require('lodash');

function filterInstancesByEvaluable({ instances, evaluable, calificableOnly }) {
  return filter(instances, (instance) => {
    if (calificableOnly) {
      return instance.gradable === true;
    }

    return instance.requiresScoring === Boolean(evaluable);
  });
}

module.exports = { filterInstancesByEvaluable };

const { filter } = require("lodash")

function filterInstancesByEvaluable({ instances, evaluable }) {
  return filter(instances, (instance => instance.requiresScoring || instance.allowFeedback === Boolean(evaluable)))
}

module.exports = { filterInstancesByEvaluable }
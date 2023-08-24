const { isBoolean } = require('lodash');

function getConfigByInstance(instance) {
  const filters = instance?.metadata?.filters;
  return {
    omit: filters?.omit ? Number(filters.omit) : 0,
    allowClues: isBoolean(filters?.allowClues) ? filters?.allowClues : true,
    clues: filters?.clues
      ? filters?.clues
      : [
          { type: 'hide-response', value: 0, canUse: true },
          { type: 'note', value: 0, canUse: true },
        ],
    wrong: filters?.wrong ? Number(filters.wrong) : 0,
    canOmitQuestions: isBoolean(filters?.canOmitQuestions) ? filters?.canOmitQuestions : true,
  };
}

module.exports = { getConfigByInstance };

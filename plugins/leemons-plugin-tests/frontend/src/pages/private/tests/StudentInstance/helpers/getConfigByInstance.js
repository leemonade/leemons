/**
 * This file is located in the frontend folder, but hardlinked in backend
 * Remember that it should not import other files, nor backend nor frontend.
 *
 * Frontend directory (original): plugins-tests/frontend/src/pages/private/tests/StudentInstance/helpers
 * Backend directory (hardlink): plugin-tests/backend/core/tests/helpers
 *
 * Be careful, git does not track hardlinks, so check if both files are modified, if not, create the hardlink
 * in your environment from plugin-tests/backend/core/tests/helpers with:
 * `ln ../../../../frontend/src/pages/private/tests/StudentInstance/helpers/getConfigByInstance.js`
 */

const { isBoolean } = require('lodash');

function getConfigByInstance(instance) {
  const filters = instance?.metadata?.filters;
  const questionFilters = instance?.metadata?.filters?.questionFilters;
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
    questionFilters,
  };
}

module.exports = { getConfigByInstance };

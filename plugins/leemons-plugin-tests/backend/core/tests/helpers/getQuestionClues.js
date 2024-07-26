/**
 * This file is located in the frontend folder, but hardlinked in backend
 * Remember that it should not import other files, nor backend nor frontend.
 *
 * Frontend directory (original): plugins-tests/frontend/src/pages/private/tests/StudentInstance/helpers
 * Backend directory (hardlink): plugin-tests/backend/core/tests/helpers
 *
 * Be careful, git does not track hardlinks, so check if both files are modified, if not, create the hardlink
 * in your environment from plugin-tests/backend/core/tests/helpers with:
 * `ln ../../../../frontend/src/pages/private/tests/StudentInstance/helpers/getQuestionClues.js`
 */

const { forEach, isNumber, isString } = require('lodash');

function getQuestionClues(question, limit, config) {
  let clues = [];
  const hideResponses = [];
  const notes = [];

  if (question.type === 'map') {
    const responsesIndexsToHide = [];
    forEach(question.mapProperties.markers.list, (response, index) => {
      if (response.hideOnHelp) {
        responsesIndexsToHide.push(index);
      }
    });
    if (responsesIndexsToHide.length) {
      hideResponses.push({
        type: 'hide-response',
        indexs: responsesIndexsToHide,
      });
    }
  }

  if (question.type === 'mono-response') {
    const responsesIndexsToHide = [];
    forEach(question.choices, (choice, index) => {
      if (choice.hideOnHelp) {
        responsesIndexsToHide.push(index);
      }
    });
    if (responsesIndexsToHide.length) {
      hideResponses.push({
        type: 'hide-response',
        indexs: responsesIndexsToHide,
      });
    }
  }

  if (question.clues?.length) {
    forEach(isString(question.clues) ? JSON.parse(question.clues) : question.clues, (clue) => {
      notes.push({
        type: 'note',
        text: clue,
      });
    });
  }

  if (config.allowClues) {
    forEach(config.clues, (clue) => {
      if (clue.canUse) {
        if (clue.type === 'hide-response') {
          clues = clues.concat(hideResponses);
        }
        if (clue.type === 'note') {
          clues = clues.concat(notes);
        }
      }
    });
  }

  if (isNumber(limit)) {
    return clues.slice(0, limit);
  }
  return clues;
}

module.exports = { getQuestionClues };

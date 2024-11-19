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

const { forEach, isNumber, isString, filter, isArray } = require('lodash');

const { QUESTION_TYPES } = require('@tests/pages/private/questions-banks/questionConstants');

function getQuestionClues(question, types, config) {
  let clues = [];
  const hideResponses = [];
  const notes = [];

  if (question.type === QUESTION_TYPES.MAP) {
    const responsesIndicesToHide = [];
    forEach(question.mapProperties.markers.list, (response, index) => {
      if (response.hideOnHelp) {
        responsesIndicesToHide.push(index);
      }
    });
    if (responsesIndicesToHide.length) {
      hideResponses.push({
        type: 'hide-response',
        indexs: responsesIndicesToHide, // TODO update map responses to use the correct word here, it can be very misleading
      });
    }
  }

  if (question.type === QUESTION_TYPES.MONO_RESPONSE) {
    const responsesIndicesToHide = [];
    forEach(question.choices, (choice, index) => {
      if (choice.hideOnHelp) {
        responsesIndicesToHide.push(index);
      }
    });
    if (responsesIndicesToHide.length) {
      hideResponses.push({
        type: 'hide-response',
        indices: responsesIndicesToHide,
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

  if (isArray(types) || typeof types === 'undefined') {
    return filter(clues, (clue) => {
      if (typeof types === 'undefined') return false;
      return types.includes(clue.type);
    });
  }
  return clues;
}

module.exports = { getQuestionClues };

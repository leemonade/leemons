const { forEach, isNumber, isString } = require('lodash');

function getQuestionClues(question, limit, config) {
  let clues = [];
  const hideResponses = [];
  const notes = [];

  if (question.type === 'map') {
    const responsesIndexsToHide = [];
    forEach(question.properties.markers.list, (response, index) => {
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
    forEach(question.properties.responses, (response, index) => {
      if (response.value.hideOnHelp) {
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
        text: clue.value,
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

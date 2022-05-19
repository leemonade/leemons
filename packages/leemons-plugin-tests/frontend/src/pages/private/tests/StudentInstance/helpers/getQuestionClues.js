import { forEach, isNumber } from 'lodash';

export function getQuestionClues(question, limit) {
  const clues = [];

  console.log(question);

  if (question.type === 'map') {
    const responsesIndexsToHide = [];
    forEach(question.properties.markers.list, (response, index) => {
      if (response.hideOnHelp) {
        responsesIndexsToHide.push(index);
      }
    });
    if (responsesIndexsToHide.length) {
      clues.push({
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
      clues.push({
        type: 'hide-response',
        indexs: responsesIndexsToHide,
      });
    }
  }

  if (question.clues?.length) {
    forEach(question.clues, (clue) => {
      clues.push({
        type: 'note',
        text: clue.value,
      });
    });
  }

  if (isNumber(limit)) {
    return clues.slice(0, limit);
  }
  return clues;
}

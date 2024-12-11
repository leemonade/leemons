import { camelCase, forIn, noop } from 'lodash';

const QUESTION_TYPES = {
  MONO_RESPONSE: 'mono-response',
  SHORT_RESPONSE: 'short-response',
  MAP: 'map',
  TRUE_FALSE: 'true-false',
  OPEN_RESPONSE: 'open-response',
};

const SOLUTION_KEY_BY_TYPE = {
  [QUESTION_TYPES.MONO_RESPONSE]: 'choices',
  [QUESTION_TYPES.SHORT_RESPONSE]: 'choices',
  [QUESTION_TYPES.OPEN_RESPONSE]: 'openResponseProperties',
  [QUESTION_TYPES.TRUE_FALSE]: 'trueFalseProperties',
  [QUESTION_TYPES.MAP]: 'mapProperties.markers.list',
};

const QUESTION_TYPES_WITH_HIDDEN_ANSWERS = [QUESTION_TYPES.MAP, QUESTION_TYPES.MONO_RESPONSE];

const QUESTION_TYPES_WITH_MIN_RESPONSES_TO_ADD_CLUES = [
  QUESTION_TYPES.MAP,
  QUESTION_TYPES.MONO_RESPONSE,
];

const getQuestionTypesForSelect = (t = noop, skip = []) => {
  const options = [];

  forIn(QUESTION_TYPES, (value) => {
    if (skip.includes(value)) return;

    options.push({
      value,
      label: t(camelCase(value)),
    });
  });

  return options;
};

export {
  QUESTION_TYPES,
  SOLUTION_KEY_BY_TYPE,
  QUESTION_TYPES_WITH_HIDDEN_ANSWERS,
  QUESTION_TYPES_WITH_MIN_RESPONSES_TO_ADD_CLUES,
  getQuestionTypesForSelect,
};

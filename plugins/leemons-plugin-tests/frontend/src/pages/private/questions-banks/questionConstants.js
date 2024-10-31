import { camelCase, forIn, noop } from 'lodash';

const QUESTION_TYPES = {
  MONO_RESPONSE: 'mono-response',
  MAP: 'map',
};

const SOLUTION_KEY_BY_TYPE = {
  [QUESTION_TYPES.MONO_RESPONSE]: 'choices',
  [QUESTION_TYPES.MAP]: 'mapProperties.markers.list',
};

const getQuestionTypesForSelect = (t = noop) => {
  const options = [];

  forIn(QUESTION_TYPES, (value) => {
    options.push({
      value,
      label: t(camelCase(value)),
    });
  });

  return options;
};

export { QUESTION_TYPES, SOLUTION_KEY_BY_TYPE, getQuestionTypesForSelect };

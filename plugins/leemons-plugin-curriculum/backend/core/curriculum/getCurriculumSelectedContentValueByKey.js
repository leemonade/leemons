// eslint-disable-next-line import/prefer-default-export
const { forEach } = require('lodash');

function getCurriculumSelectedContentValueByKey(key) {
  const result = {};
  const split = key.split('|');
  forEach(split, (sp) => {
    const keyval = sp.split('.');
    // eslint-disable-next-line prefer-destructuring
    result[keyval[0]] = keyval[1];
  });
  return { ...result, key };
}

module.exports = { getCurriculumSelectedContentValueByKey };

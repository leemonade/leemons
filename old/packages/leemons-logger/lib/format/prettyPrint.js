const { format } = require('winston');
const _ = require('lodash');

const { printf } = format;

module.exports = printf(({ timestamp, level, labels = {}, message }) => {
  // const stringifiedRest = JSON.stringify(rest);
  const labelsValues = Object.values(_.omit(labels, ['pid', 'isMaster']));
  const data = [timestamp, level];
  if (labelsValues.length) {
    data.push(`[${labelsValues.splice(0, 2).join(', ')}]`);
  }
  data.push(message);
  // if (stringifiedRest !== '{}') {
  //   data.push(stringifiedRest);
  // }

  return data.join(' ');
});

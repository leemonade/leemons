const { format } = require('winston');
const _ = require('lodash');

module.exports = format((f) => {
  if (!_.has(f, 'labels.pid')) {
    _.set(f, 'labels.pid', process.pid);
  }

  return f;
});

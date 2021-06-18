const _ = require('lodash');

function settledResponseToManyResponse(response) {
  const value = { items: [], count: 0, warnings: null };
  const errors = [];
  _.forEach(response, (res) => {
    if (res.status === 'fulfilled') {
      value.items.push(res);
    } else {
      errors.push(res.reason);
    }
  });
  value.count = value.items.length;
  if (errors.length) value.warnings = { errors };
  return value;
}

module.exports = { settledResponseToManyResponse };

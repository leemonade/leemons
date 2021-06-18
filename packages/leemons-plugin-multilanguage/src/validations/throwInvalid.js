const _ = require('lodash');

module.exports = (validation) => {
  let _validation;
  if (!Array.isArray(validation)) {
    _validation = [validation];
  } else {
    _validation = _.flatten(validation);
  }

  _validation.forEach((__validation) => {
    if (!__validation.valid) {
      const error = new Error(__validation.message);
      error.code = __validation.code;
      throw error;
    }
  });

  return true;
};

const string = {
  type: 'string',
  minLength: 1,
  maxLength: 255,
};

const text = {
  type: 'string',
  minLength: 1,
  maxLength: 65000,
};

const arrayStringRequired = {
  type: 'array',
  items: {
    type: 'string',
  },
  minItems: 1,
};

module.exports = {
  validateSchema: {
    text,
    string,
    arrayStringRequired,
  },
};

module.exports = {
  modelName: 'locales',
  attributes: {
    code: {
      type: 'string',
      length: 5,
      options: {
        unique: true,
      },
    },
    name: {
      type: 'string',
    },
  },
};

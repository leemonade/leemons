module.exports = {
  modelName: 'locales',
  attributes: {
    code: {
      type: 'string',
      length: 12,
      options: {
        unique: true,
      },
    },
    name: {
      type: 'string',
    },
  },
};

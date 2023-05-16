module.exports = {
  modelName: 'contents',
  attributes: {
    key: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
    value: {
      type: 'richtext',
      textType: 'text',
      options: {
        notNull: true,
      },
    },
    locale: {
      type: 'string',
      options: {
        unique: false,
      },
    },
  },
};

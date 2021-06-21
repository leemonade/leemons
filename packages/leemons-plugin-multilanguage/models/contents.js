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
      references: {
        collection: 'plugins_multilanguage::locales',
        field: 'code',
      },
      options: {
        unique: false,
      },
    },
  },
};

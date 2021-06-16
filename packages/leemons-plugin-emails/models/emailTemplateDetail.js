module.exports = {
  modelName: 'email-template-detail',
  collectionName: 'email-template-detail',
  options: {
    useTimestamps: true,
  },
  attributes: {
    template: {
      references: {
        collection: 'plugins_emails::email-template',
      },
    },
    type: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
    language: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
    subject: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
    html: {
      type: 'richtext',
      textType: 'mediumtext',
      options: {
        notNull: true,
      },
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};

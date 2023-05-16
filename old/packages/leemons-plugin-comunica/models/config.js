module.exports = {
  modelName: 'config',
  collectionName: 'config',
  options: {
    useTimestamps: true,
  },
  attributes: {
    // general | center | program
    type: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
    // if general = null, other = center/program id
    typeId: {
      type: 'string',
    },
    config: {
      type: 'text',
      textType: 'mediumText',
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};

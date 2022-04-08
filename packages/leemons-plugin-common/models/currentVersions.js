module.exports = {
  modelName: 'currentVersions',
  attributes: {
    published: {
      type: 'string',
    },
    type: {
      type: 'string',
    },
  },
  primaryKey: { type: 'uuid' },
};

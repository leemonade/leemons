module.exports = {
  modelName: 'multipart-etag',
  collectionName: 'multipart-etag',
  options: {
    useTimestamps: true,
  },
  attributes: {
    fileId: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
    etag: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
    partNumber: {
      type: 'integer',
      options: {
        notNull: true,
      },
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};

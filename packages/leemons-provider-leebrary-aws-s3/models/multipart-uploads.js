module.exports = {
  modelName: 'multipart-uploads',
  collectionName: 'multipart-uploads',
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
    uploadId: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
    path: {
      type: 'string',
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};

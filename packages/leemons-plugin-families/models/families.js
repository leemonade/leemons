module.exports = {
  modelName: 'families',
  collectionName: 'families',
  options: {
    useTimestamps: true,
  },
  attributes: {
    name: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
    maritalStatus: {
      type: 'string',
    },
    nStudents: {
      type: 'string',
    },
    nMembers: {
      type: 'string',
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};

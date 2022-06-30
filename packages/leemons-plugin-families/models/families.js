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
    nGuardians: {
      type: 'integer',
      options: {
        defaultTo: 0,
      },
    },
    nStudents: {
      type: 'integer',
      options: {
        defaultTo: 0,
      },
    },
    nMembers: {
      type: 'integer',
      options: {
        defaultTo: 0,
      },
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};

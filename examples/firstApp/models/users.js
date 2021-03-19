module.exports = {
  collectionName: 'users',
  info: {
    name: 'Users',
    description: 'All the users in the school',
  },
  options: {
    useTimestamps: true,
  },
  primaryKey: {
    type: 'uuid',
  },
  attributes: {
    name: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
    nick: {
      type: 'string',
      length: 32,
      options: {
        unique: true,
      },
    },
    email: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
    age: {
      type: 'int',
    },
    role: {
      references: {
        collection: 'global::roles',
        relation: 'one to many',
        onUpdate: 'cascade',
        onDelete: 'cascade',
      },
    },

    class: {
      references: {
        collection: 'global::class',
        relation: 'many to many',
      },
    },
    subjects: {
      references: {
        collection: 'global::subjects',
        relation: 'many to many',
      },
    },
  },
};

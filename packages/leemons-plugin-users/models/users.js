module.exports = {
  modelName: 'users',
  collectionName: 'users',
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
    surnames: {
      type: 'string',
    },
    secondSurname: {
      type: 'string',
    },
    email: {
      type: 'string',
      options: {
        unique: true,
        notNull: true,
      },
    },
    phone: {
      type: 'string',
    },
    avatar: {
      type: 'string',
    },
    avatarAsset: {
      type: 'string',
    },
    birthdate: {
      type: 'datetime',
      options: {
        notNull: true,
      },
    },
    password: {
      type: 'string',
      options: {
        hidden: true,
      },
    },
    locale: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
    active: {
      type: 'boolean',
      options: {
        notNull: true,
        defaultTo: false,
      },
    },
    status: {
      type: 'string',
    },
    // masculino, femenino
    gender: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};

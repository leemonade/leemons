module.exports = {
  modelName: 'centers',
  collectionName: 'centers',
  options: {
    useTimestamps: true,
  },
  attributes: {
    name: {
      type: 'string',
      options: {
        notNull: true,
        unique: true,
      },
    },
    description: {
      type: 'string',
    },
    locale: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
    email: {
      type: 'string',
    },
    uri: {
      type: 'string',
      options: {
        notNull: true,
        unique: true,
      },
    },
    timezone: {
      type: 'string',
    },
    firstDayOfWeek: {
      type: 'number',
    },
    country: {
      type: 'string',
    },
    city: {
      type: 'string',
    },
    postalCode: {
      type: 'string',
    },
    street: {
      type: 'string',
    },
    phone: {
      type: 'string',
    },
    contactEmail: {
      type: 'string',
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};

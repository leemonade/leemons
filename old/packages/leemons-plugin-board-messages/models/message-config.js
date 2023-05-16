module.exports = {
  modelName: 'message-config',
  collectionName: 'message-config',
  options: {
    useTimestamps: true,
  },
  attributes: {
    internalName: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
    message: {
      type: 'text',
      textType: 'mediumText',
      options: {
        notNull: true,
      },
    },
    asset: {
      type: 'string',
    },
    url: {
      type: 'string',
    },
    textUrl: {
      type: 'string',
    },
    // modal | dashboard | class-dashboard
    zone: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
    // immediately | programmed
    publicationType: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
    // published | programmed | completed | unpublished | archived
    status: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
    owner: {
      type: 'string',
    },
    userOwner: {
      type: 'string',
    },
    totalViews: {
      type: 'integer',
    },
    totalClicks: {
      type: 'integer',
    },
    startDate: {
      type: 'datetime',
    },
    endDate: {
      type: 'datetime',
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};

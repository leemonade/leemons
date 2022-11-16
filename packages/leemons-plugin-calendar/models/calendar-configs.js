module.exports = {
  modelName: 'calendar-configs',
  collectionName: 'calendar-configs',
  options: {
    useTimestamps: true,
  },
  attributes: {
    title: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
    description: {
      type: 'string',
    },
    addedFrom: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
    countryName: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
    countryShortCode: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
    regionShortCode: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
    regionName: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
    startMonth: {
      type: 'integer',
      options: {
        notNull: true,
      },
    },
    startYear: {
      type: 'integer',
      options: {
        notNull: true,
      },
    },
    endMonth: {
      type: 'integer',
      options: {
        notNull: true,
      },
    },
    endYear: {
      type: 'integer',
      options: {
        notNull: true,
      },
    },
    weekday: {
      type: 'integer',
      options: {
        notNull: true,
      },
    },
    notSchoolDays: {
      type: 'text',
      textType: 'mediumText',
      options: {
        notNull: true,
      },
    },
    schoolDays: {
      type: 'text',
      textType: 'mediumText',
      options: {
        notNull: true,
      },
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};

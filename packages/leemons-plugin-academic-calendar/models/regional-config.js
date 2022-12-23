module.exports = {
  modelName: 'regional-config',
  collectionName: 'regional-config',
  options: {
    useTimestamps: true,
  },
  attributes: {
    name: {
      type: 'string',
    },
    center: {
      type: 'string',
    },
    regionalEventsRel: {
      type: 'string',
    },
    regionalEvents: {
      type: 'text',
      textType: 'mediumText',
      // [{name: 'Recreo',  startDate: Date, endDate: Date}]
    },
    localEvents: {
      type: 'text',
      textType: 'mediumText',
      // [{name: 'Recreo',  startDate: Date, endDate: Date}]
    },
    daysOffEvents: {
      type: 'text',
      textType: 'mediumText',
      // [{name: 'Recreo',  startDate: Date, endDate: Date}]
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};

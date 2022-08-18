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
      type: 'json',
      // [{name: 'Recreo',  startDate: Date, endDate: Date}]
    },
    localEvents: {
      type: 'json',
      // [{name: 'Recreo',  startDate: Date, endDate: Date}]
    },
    daysOffEvents: {
      type: 'json',
      // [{name: 'Recreo',  startDate: Date, endDate: Date}]
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};

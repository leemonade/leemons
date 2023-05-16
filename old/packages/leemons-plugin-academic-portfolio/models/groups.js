module.exports = {
  modelName: 'groups',
  collectionName: 'groups',
  options: {
    useTimestamps: true,
  },
  attributes: {
    name: {
      type: 'string',
    },
    abbreviation: {
      type: 'string',
    },
    index: {
      type: 'integer',
    },
    program: {
      references: {
        collection: 'plugins_academic-portfolio::programs',
      },
    },
    // course / group / substage
    type: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
    // Si es course son los creditos
    // Si es substage es el numero de etapas
    number: {
      type: 'integer',
    },
    // Only for customSubstages
    frequency: {
      type: 'string',
    },
    isAlone: {
      type: 'boolean',
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};

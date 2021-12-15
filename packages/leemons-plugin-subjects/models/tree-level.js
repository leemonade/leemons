module.exports = {
  modelName: 'tree-level',
  collectionName: 'tree-level',
  options: {
    useTimestamps: true,
  },
  attributes: {
    parentKey: {
      type: 'string',
    },
    name: {
      type: 'string',
    },
    order: {
      type: 'integer',
    },
    iconName: {
      type: 'string',
    },
    iconActiveName: {
      type: 'string',
    },
    iconSvg: {
      type: 'string',
    },
    iconActiveSvg: {
      type: 'string',
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};

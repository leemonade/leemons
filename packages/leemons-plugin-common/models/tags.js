module.exports = {
  modelName: 'tags',
  collectionName: 'tags',
  options: {
    useTimestamps: true,
  },
  attributes: {
    type: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
    tag: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
    value: {
      type: 'string',
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};

[
  { type: '1', tag: '1', value: 'a' },
  { type: '1', tag: '2', value: 'b' },
  { type: '1', tag: '3', value: 'n' },
  { type: '1', tag: '3', value: 'sdn' },
  { type: '1', tag: '3', value: 'nf' },
  { type: '2', tag: '33gr', value: 'n' },
];

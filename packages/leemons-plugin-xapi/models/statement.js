module.exports = {
  modelName: 'statement',
  collectionName: 'statement',
  connection: 'mongo',
  options: {
    useTimestamps: true,
  },
  attributes: {
    // https://github.com/adlnet/xAPI-Spec/blob/master/xAPI-Data.md#24-statement-properties
    statement: {
      type: 'mixed',
    },
    // log | learning
    type: {
      type: 'string',
    },
    organization: {
      type: 'string',
    },
  },
};

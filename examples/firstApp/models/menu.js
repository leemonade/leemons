module.exports = {
  collectionName: 'allInOne',
  info: {
    name: 'allInOne',
    description: 'Esta tabla lo tiene todo!',
  },
  options: {},
  attributes: {
    string: {
      type: 'string',
    },
    string2: {
      type: 'string',
      length: 2,
    },
    enum: {
      type: 'enum',
      enum: ['a', 'b', 'c'],
    },
    json: {
      type: 'json',
    },
    int: {
      type: 'int',
    },
    bigInt: {
      type: 'bigint',
    },
    float: {
      type: 'float',
    },
    decimal: {
      type: 'decimal',
    },
    binary: {
      type: 'binary',
    },
    binary2: {
      type: 'binary',
      length: 2,
    },
    boolean: {
      type: 'boolean',
    },
    uuid: {
      type: 'uuid',
    },
  },
};

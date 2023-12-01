// automatic hash: 3aeef7ac23a7a7136cfa39c30480472f785db7b6f4c7d57edaec930f4af95864
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    finished: {
      type: 'string',
      minLength: 1,
    },
    finished_$gt: {
      type: 'string',
      minLength: 1,
    },
    finished_$lt: {
      type: 'string',
      minLength: 1,
    },
    classes: {
      type: 'array',
      items: {
        required: [],
        properties: {},
      },
    },
  },
  required: ['finished', 'finished_$gt', 'finished_$lt', 'classes'],
};

module.exports = { schema };

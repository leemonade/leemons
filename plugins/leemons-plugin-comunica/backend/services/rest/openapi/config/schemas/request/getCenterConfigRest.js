// automatic hash: 38102a3da02ba8ae3ec61433f847dadc156588e210fc79fef7b15cb02cae9546
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    center: {
      type: 'string',
      minLength: 1,
    },
  },
  required: ['center'],
};

module.exports = { schema };

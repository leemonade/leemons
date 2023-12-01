// automatic hash: f0af4da9dadf30e939dc9940233fac32fc28a298f69d765830e70dc69bcb8735
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    subjects: {
      type: 'string',
      minLength: 1,
    },
  },
  required: ['subjects'],
};

module.exports = { schema };

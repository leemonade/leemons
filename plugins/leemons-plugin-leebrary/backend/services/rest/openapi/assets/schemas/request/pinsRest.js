// automatic hash: c80f078677d41504ec8ec86e487e44574b60cc865db4394102a0d58c4b9be7c2
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    providerQuery: {
      type: 'string',
      minLength: 1,
    },
    category: {
      type: 'string',
      minLength: 1,
    },
    criteria: {
      type: 'string',
    },
    type: {
      type: 'string',
    },
    published: {
      type: 'string',
      minLength: 1,
    },
    preferCurrent: {
      type: 'string',
      minLength: 1,
    },
    searchInProvider: {
      type: 'string',
      minLength: 1,
    },
    subjects: {
      type: 'string',
      minLength: 1,
    },
    programs: {
      type: 'string',
      minLength: 1,
    },
    roles: {
      type: 'string',
      minLength: 1,
    },
    showPublic: {
      type: 'string',
      minLength: 1,
    },
  },
  required: [
    'providerQuery',
    'category',
    'criteria',
    'type',
    'published',
    'preferCurrent',
    'searchInProvider',
    'subjects',
    'programs',
    'roles',
    'showPublic',
  ],
};

module.exports = { schema };

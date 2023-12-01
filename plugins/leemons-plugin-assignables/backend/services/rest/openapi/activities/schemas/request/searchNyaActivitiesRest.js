// automatic hash: c46e62d288e639dcd02897ea73de6442a1a1e0f8edbd521de206da76a3fc2e95
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    isTeacher: {
      type: 'string',
      minLength: 1,
    },
    programs: {
      type: 'string',
      minLength: 1,
    },
    classes: {
      type: 'string',
      minLength: 1,
    },
    limit: {
      type: 'string',
      minLength: 1,
    },
  },
  required: ['isTeacher', 'programs', 'classes', 'limit'],
};

module.exports = { schema };

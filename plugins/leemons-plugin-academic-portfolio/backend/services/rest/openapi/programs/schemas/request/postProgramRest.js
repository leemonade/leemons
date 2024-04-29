// automatic hash: 0905d044225da8e772b0ff29302b74ddfa2130a1c180668d3be572b3d3f4089a
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    name: {
      type: 'string',
      minLength: 1,
    },
    abbreviation: {
      type: 'string',
      minLength: 1,
    },
    centers: {
      type: 'array',
      items: {
        required: [],
        properties: {},
      },
    },
    color: {
      type: 'string',
      minLength: 1,
    },
    image: {
      type: 'string',
      minLength: 1,
    },
    evaluationSystem: {
      type: 'string',
      minLength: 1,
    },
    cycles: {
      type: 'array',
      items: {
        required: [],
        properties: {},
      },
    },
    haveCycles: {
      type: 'boolean',
    },
    maxNumberOfCourses: {
      type: 'number',
    },
    credits: {},
    totalHours: {},
    moreThanOneAcademicYear: {
      type: 'boolean',
    },
    hasSubjectTypes: {
      type: 'boolean',
    },
    hideStudentsToStudents: {
      type: 'boolean',
    },
    hoursPerCredit: {},
    numberOfSubstages: {
      type: 'number',
    },
    sequentialCourses: {
      type: 'boolean',
    },
    substages: {
      type: 'array',
      items: {
        required: [],
        properties: {},
      },
    },
    useAutoAssignment: {
      type: 'boolean',
    },
    useCustomSubjectIds: {
      type: 'boolean',
    },
    haveKnowledge: {
      type: 'boolean',
    },
    maxSubstageAbbreviationIsOnlyNumbers: {
      type: 'boolean',
    },
  },
  required: [
    'name',
    'abbreviation',
    'centers',
    'color',
    'image',
    'evaluationSystem',
    'cycles',
    'haveCycles',
    'maxNumberOfCourses',
    'moreThanOneAcademicYear',
    'hasSubjectTypes',
    'hideStudentsToStudents',
    'numberOfSubstages',
    'sequentialCourses',
    'substages',
    'useAutoAssignment',
    'useCustomSubjectIds',
    'haveKnowledge',
    'maxSubstageAbbreviationIsOnlyNumbers',
  ],
};

module.exports = { schema };

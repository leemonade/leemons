module.exports = function getAssignableObject() {
  return {
    asset: {
      name: 'Assignable name',
      tagline: 'Tagline example',
      description: 'Description example',
      tags: ['tag1', 'tag2'],
      color: '#333',
      cover: '12345',
    },
    role: 'plugins.example',
    gradable: true,
    center: '550e8400-e29b-41d4-a716-446655440000',
    subjects: [
      {
        program: '550e8400-e29b-41d4-a716-446655440000',
        subject: '550e8400-e29b-41d4-a716-446655440000',
        level: 'intermediate',
        curriculum: null,
      },
    ],
    statement: '<p>This is a statement</p>',
    development: '<p>This is a development</p>',
    duration: '10 minutes',
    resources: [
      '550e8400-e29b-41d4-a716-446655440000@1.0.0',
      '550e8400-e29b-41d4-a716-446655440000@2.0.0',
    ],
    submission: {
      anyProp: 'this is a prop',
    },
    metadata: {
      thisProp: 'Can be anything',
      leebrary: {
        test: [
          '550e8400-e29b-41d4-a716-446655440000@1.0.0',
          '550e8400-e29b-41d4-a716-446655440000@2.0.0',
        ],
        other: '550e8400-e29b-41d4-a716-446655440000@1.0.0',
      },
    },
  };
};

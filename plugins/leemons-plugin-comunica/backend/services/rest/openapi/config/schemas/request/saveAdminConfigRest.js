// automatic hash: bc7efbc7e2681c06314ae8fb668f0275bb21792d072b681fea37139fe154c7f8
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    center: {
      type: 'string',
      minLength: 1,
    },
    enabled: {
      type: 'boolean',
    },
    studentsCanAddTeachersToGroups: {
      type: 'boolean',
    },
    tenorApiKey: {},
    program: {
      type: 'object',
      properties: {
        'lrn:local:academic-portfolio:local:662f652a421c6b5e1e839b6c:Programs:662f65cd9f06d6bbeb6281f6':
          {
            type: 'object',
            properties: {
              enableSubjectsRoom: {
                type: 'boolean',
              },
              teachersCanDisableSubjectsRooms: {
                type: 'boolean',
              },
              teachersCanMuteStudents: {
                type: 'boolean',
              },
              onlyTeachersCanWriteInSubjectsRooms: {
                type: 'boolean',
              },
            },
            required: [
              'enableSubjectsRoom',
              'teachersCanDisableSubjectsRooms',
              'teachersCanMuteStudents',
              'onlyTeachersCanWriteInSubjectsRooms',
            ],
          },
      },
      required: [
        'lrn:local:academic-portfolio:local:662f652a421c6b5e1e839b6c:Programs:662f65cd9f06d6bbeb6281f6',
      ],
    },
    enableStudentsChats: {
      type: 'boolean',
    },
    enableStudentsCreateGroups: {
      type: 'boolean',
    },
  },
  required: [
    'center',
    'enabled',
    'studentsCanAddTeachersToGroups',
    'program',
    'enableStudentsChats',
    'enableStudentsCreateGroups',
  ],
};

module.exports = { schema };

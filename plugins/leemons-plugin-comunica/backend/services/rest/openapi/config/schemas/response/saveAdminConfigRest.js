// automatic hash: bd2d175865c2ba477d52a42fbb6613af28a6c561bf382d88e4e6d0c362aeb3d2
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    status: {
      type: 'number',
    },
    config: {
      type: 'object',
      properties: {
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
        'enabled',
        'studentsCanAddTeachersToGroups',
        'program',
        'enableStudentsChats',
        'enableStudentsCreateGroups',
      ],
    },
  },
  required: ['status', 'config'],
};

module.exports = { schema };

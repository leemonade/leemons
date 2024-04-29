// automatic hash: 5a2dec483bf830edc21554c5000b013f00f83f3af75607227e361663d3b156f2
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
        enableStudentsChats: {
          type: 'boolean',
        },
        enableStudentsCreateGroups: {
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
      },
      required: [
        'enabled',
        'enableStudentsChats',
        'enableStudentsCreateGroups',
        'studentsCanAddTeachersToGroups',
        'program',
      ],
    },
  },
  required: ['status', 'config'],
};

module.exports = { schema };

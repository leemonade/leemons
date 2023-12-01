// automatic hash: 6335ce5e65bead30253164a0ba894494cc062b16754ff7780a7345133a4dec10
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
  required: ['status', 'config'],
};

module.exports = { schema };

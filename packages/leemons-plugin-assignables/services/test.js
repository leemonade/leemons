const createAssignable = require('../src/services/assignable/createAssignable');
const getAssignable = require('../src/services/assignable/getAssignable');
const updateAssignable = require('../src/services/assignable/updateAssignable');
const { assignables } = require('../src/services/tables');

const assignable = {
  asset: 'bf9f8f8f-8f8f-8f8f-8f8f-8f8f8f8f8f8f@1.0.0',
  role: 'task',
  gradable: true,
  program: 'bf9f8f8f-8f8f-8f8f-8f8f-8f8f8f8f8f8f',
  subjects: [
    {
      subject: 'bf9f8f8f-8f8f-8f8f-8f8f-8f8f8f8f8f8f',
      level: '1',
      curriculum: {},
    },
    {
      subject: 'bf9f8f8f-8f8f-8f8f-8f8f-8f8f8f8f8f8f',
      level: '2',
      curriculum: {},
    },
  ],
  methodology: 'methodology',
  statement: 'statement',
  development: 'development',
  duration: 'duration',
  // attachments
  submission: {
    type: 'link',
    title: 'Submission',
    description: 'Submission description',
  },
  instructionsForTeachers: 'instructionsForTeachers',
  instructionsForStudents: 'instructionsForStudents',
  metadata: {
    role: 'task',
  },
};
global.utils.withTransaction(async (transacting) => {
  let data = await createAssignable(assignable, { transacting });
  const { id } = data;

  data = await updateAssignable(
    { id, program: 'bf9f8f8f-8f8f-8f8f-8f8f-8f8f8f8f8f8e', instructionsForTeachers: null },
    { transacting }
  );

  data = await getAssignable(id, { transacting });

  throw new Error('cleanup');
}, assignables);

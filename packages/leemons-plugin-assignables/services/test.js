const { assignables } = require('../src/services/tables');

module.exports = function main(userSession) {
  const services = leemons.getPlugin('assignables').services.assignables;

  const {
    registerRole,
    createAssignable,
    // getAssignable,
    // publishAssignable,
    // removeAssignable,
    // updateAssignable,
  } = services;

  const unit = {
    asset: 'bf9f8f8f-8f8f-8f8f-8f8f-8f8f8f8f8f8f@1.0.0',
    role: 'unit',
    gradable: false,
    program: 'bf9f8f8f-8f8f-8f8f-8f8f-8f8f8f8f8f8f',
    subjects: [
      {
        subject: 'bf9f8f8f-8f8f-8f8f-8f8f-8f8f8f8f8f8f',
        level: 'hard',
        curriculum: {},
      },
      {
        subject: 'bf9f8f8f-8f8f-8f8f-8f8f-8f8f8f8f8f8f',
        level: 'easy',
        curriculum: {},
      },
    ],
    methodology: 'PBL',
    statement: 'This is the statement of the unit',
    development: 'This is the development of the unit',
    duration: '7 days',
    // attachments
    submission: null,
    instructionsForTeachers: 'Assign this unit to your students',
    instructionsForStudents: 'Do all the tasks of this unit in order',
  };

  const preTask = {
    asset: 'bf9f8f8f-8f8f-8f8f-8f8f-8f8f8f8f8f8f@1.0.0',
    role: 'pretask',
    gradable: false,
    program: 'bf9f8f8f-8f8f-8f8f-8f8f-8f8f8f8f8f8f',
    subjects: [
      {
        subject: 'bf9f8f8f-8f8f-8f8f-8f8f-8f8f8f8f8f8f',
        level: 'hard',
        curriculum: {},
      },
      {
        subject: 'bf9f8f8f-8f8f-8f8f-8f8f-8f8f8f8f8f8f',
        level: 'easy',
        curriculum: {},
      },
    ],
    methodology: 'PBL',
    statement: 'This is the statement of the pretask',
    development: 'This is the development of the pretask',
    duration: '10 minutes',
    // attachments
    submission: {
      type: 'test',
      id: 'bf9f8f8f-8f8f-8f8f-8f8f-8f8f8f8f8f8f',
      title: 'Test',
      description: 'Test description',
    },
  };

  const task = {
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
      {
        subject: 'bf9f8f8f-8f8f-8f8f-8f8f-8f8f8f8f8f8f',
        level: '3',
        curriculum: {},
      },
    ],
    methodology: 'PBL',
    statement: 'This is the statement of the task',
    development: 'This is the development of the task',
    duration: '5 days',
    // attachments
    submission: {
      type: 'link',
      title: 'Submission',
      description: 'Submission description',
    },
    instructionsForTeachers: 'Assign this task to your students',
    instructionsForStudents: 'Plan and do the task',
  };

  return global.utils.withTransaction(async (transacting) => {
    // EN: Register role for the assignables.
    // ES: Registra el rol para el asignables.
    await registerRole('unit', { transacting });
    await registerRole('task', { transacting });
    await registerRole('pretask', { transacting });

    // const preTaskAssignable = await createAssignable(
    //   {
    //     ...preTask,
    //     metadata: { conditions: { complete: { condition: 'minGrade', minGrade: 7 } } },
    //   },
    //   { transacting }
    // );
    // const taskAssignable = await createAssignable(
    //   {
    //     ...task,
    //     metadata: {
    //       related: [{ type: 'pre', id: preTaskAssignable.id }],
    //       conditions: { complete: { condition: 'submit' } },
    //     },
    //   },
    //   { transacting }
    // );
    // const unitAssignable = await createAssignable(
    //   { ...unit, metadata: { related: [{ type: 'pre', id: taskAssignable.id }], conditions: {} } },
    //   { transacting }
    // );

    // console.log('unit', inspect(unitAssignable, { depth: null, colors: true }));
    // console.log('task', inspect(taskAssignable, { depth: null, colors: true }));
    // console.log('pretask', inspect(preTaskAssignable, { depth: null, colors: true }));

    const data = await createAssignable(task, { userSession, transacting });
    const { id } = data;

    // console.log('created', data);

    // data = await publishAssignable(id, { transacting });

    // console.log('published', data);

    // data = await getAssignable(id, { transacting });

    // console.log('get', data);

    // data = await updateAssignable(
    //   {
    //     id,
    //     subjects: [
    //       {
    //         subject: 'bf9f8f8f-8f8f-8f8f-8f8f-8f8f8f8f8f8f',
    //         level: '1',
    //         curriculum: {},
    //       },
    //       {
    //         subject: 'bf9f8f8f-8f8f-8f8f-8f8f-8f8f8f8f8f8f',
    //         level: 'Hard',
    //       },
    //     ],
    //   },
    //   { transacting }
    // );
    // console.log('Updated', data);

    // data = await publishAssignable(data.id, { transacting });
    // console.log('published', data);

    // data = await getAssignable(id, { transacting });

    // console.log('get', data);

    // data = await removeAssignable(data.id, { transacting });

    // console.log('removed', data);

    throw new Error('cleanup');
  }, assignables);
};

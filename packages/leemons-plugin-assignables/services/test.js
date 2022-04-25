const { inspect } = require('util');
const { assignables } = require('../src/services/tables');

module.exports = function main(userSession) {
  const { services } = leemons.getPlugin('assignables');

  const {
    registerRole,
    createAssignable,
    addUserToAssignable,
    // removeUserFromAssignable,
    // listAssignableUserAgents,
    // searchAssignables,
    // getAssignable,
    // publishAssignable,
    removeAssignable,
    // updateAssignable,
  } = services.assignables;

  const {
    createAssignableInstance,
    getAssignableInstance,
    removeAssignableInstance,
    updateAssignableInstance,
  } = services.assignableInstances;

  const { createAssignation, getAssignation } = services.assignations;

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
    relatedAssignables: {
      before: [],
      after: [
        // {
        //   id: 'bf9f8f8f-8f8f-8f8f-8f8f-8f8f8f8f8f8f',
        //   type: 'postTask',
        //   conditionsToPass: [],
        //   conditionsToDo: [],
        // },
      ],
    },
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

  const taskInstance = {
    // assignable: task.id,
    alwaysAvailable: false,
    dates: {
      // AJV date-time
      start: new Date('2019-01-01T00:00:00.000Z'),
      deadline: new Date('2019-01-01T00:00:00.000Z'),
      visibility: new Date('2019-01-01T00:00:00.000Z'),
      close: new Date('2019-01-01T00:00:00.000Z'),
    },
    duration: '5 minutes',
    gradable: true,
    classes: ['5c1a0489-8e1d-4ba2-ac0d-d195144f1507'],
    students: [
      {
        id: '98e5f5d0-7f59-4629-8c47-23928e5b48e0',
        classes: ['5c1a0489-8e1d-4ba2-ac0d-d195144f1507'],
      },
    ],
    messageToAssignees: '<p>This is the message</p>',
    curriculum: {
      content: true,
      assessmentCriteria: true,
      objectives: true,
    },
    metadata: {},
  };

  return global.utils.withTransaction(async (transacting) => {
    // EN: Register role for the assignables.
    // ES: Registra el rol para el asignables.
    // await registerRole('unit', { transacting });
    await registerRole('task', { transacting });
    await registerRole('pretask', { transacting });

    // EN: Create the assignable
    // ES: Crea el asignable

    // preTask
    const { id: preTaskId } = await createAssignable(preTask, { userSession, transacting });
    // task
    const data = await createAssignable(
      {
        ...task,
        relatedAssignables: {
          ...task.relatedAssignables,
          before: [
            {
              id: preTaskId,
              type: 'preTask',
              conditionsToPass: [
                { type: 'grade', minGrade: 5 },
                { type: 'pass' },
                { type: 'time', minTime: '10 minutes', maxTime: '15 minutes' },
              ],
              conditionsToDo: [],
              maxRetries: 3,
            },
          ],
        },
      },
      { userSession, transacting }
    );
    const { id } = data;

    // EN: Add other teachers to the assignable
    // ES: Añade otros profesores al asignable
    const results = await addUserToAssignable(
      id,
      ['98e5f5d0-7f59-4629-8c47-23928e5b48e0'],
      'viewer',
      { userSession, transacting }
    );

    await addUserToAssignable(id, ['cf02401d-0eea-4bbb-89b4-ca02a9ebfe61'], 'student', {
      userSession,
      transacting,
    });

    // EN: Assign the assignable to the students
    // ES: Asigna el asignable a los estudiantes
    const assignableInstance = await createAssignableInstance(
      {
        assignable: id,
        ...taskInstance,
        relatedAssignables: {
          [id]: {
            duration: '2 hours',
          },
        },
      },
      { userSession, transacting }
    );

    // console.log(
    //   'Create assignable instance',
    //   inspect(assignableInstance, { depth: null, colors: true })
    // );

    // console.log(
    //   'Update',
    //   await updateAssignableInstance(
    //     {
    //       id: assignableInstance.id,
    //       classes: ['5c1a0489-8e1d-4ba2-ac0d-d195144f1507', '5c1a0489-8e1d-4ba2-ac0d-d195144f1508'],
    //       dates: {
    //         start: new Date('2019-01-01T00:00:00.000Z'),
    //         pepe: new Date('2019-01-01T00:00:00.000Z'),
    //       },
    //     },
    //     { userSession, transacting }
    //   )
    // );

    // assignableInstance = await getAssignableInstance(assignableInstance.id, {
    //   relatedAssignableInstances: true,
    //   details: true,
    //   userSession,
    //   transacting,
    // });

    // console.log(
    //   'Get assignable instance',
    //   inspect(assignableInstance, { depth: null, colors: true })
    // );

    const assignation = await createAssignation(
      assignableInstance.id,
      ['98e5f5d0-7f59-4629-8c47-23928e5b48e0', 'cf02401d-0eea-4bbb-89b4-ca02a9ebfe61'],
      {
        indexable: true,
        classes: ['5c1a0489-8e1d-4ba2-ac0d-d195144f1507'],
        group: 'group1',
        status: 'assigned',
        metadata: {
          groupsAreTeams: true,
        },
        grades: [
          {
            subject: '5c1a0489-8e1d-4ba2-ac0d-d195144f1507',
            type: 'main',
            grade: '5c1a0489-8e1d-4ba2-ac0d-d195144f1507',
            gradedBy: '98e5f5d0-7f59-4629-8c47-23928e5b48e0',
            feedback: '<p>This is the feedback</p>',
          },
        ],
        timestamps: {
          opened: new Date(),
        },
      },
      { userSession, transacting }
    );

    console.log('assignation', assignation);

    const gotAssignation = await getAssignation(
      assignableInstance.id,
      '98e5f5d0-7f59-4629-8c47-23928e5b48e0',
      { transacting }
    );

    console.log('gotAssignation', gotAssignation);

    await removeAssignableInstance(assignableInstance.id, { userSession, transacting });

    // await listAssignableUserAgents(id, { userSession, transacting });

    // const removedPermissions = await removeUserFromAssignable(
    //   id,
    //   ['98e5f5d0-7f59-4629-8c47-23928e5b48e1'],
    //   { userSession, transacting }
    // );

    // console.log('removedPermission', removedPermissions);

    // console.log('created', data);

    // data = await publishAssignable(id, { userSession, transacting });

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
    //   { userSession, transacting }
    // );
    // console.log('Updated', data);

    // const search = await searchAssignables(
    //   'task',
    //   {
    //     published: false,
    //   },
    //   {},
    //   { userSession, transacting }
    // );

    // console.log('Search', search);

    const removed = await removeAssignable(id, { userSession, transacting });

    console.log('removed', removed);

    // data = await publishAssignable(data.id, { transacting });
    // console.log('published', data);

    // data = await getAssignable(id, { transacting });

    // console.log('get', data);

    // data = await removeAssignable(data.id, { transacting });

    // console.log('removed', data);

    throw new Error('cleanup');
  }, assignables);
};

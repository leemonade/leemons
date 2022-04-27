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
    getAssignable,
    publishAssignable,
    removeAssignable,
    updateAssignable,
  } = services.assignables;

  const {
    createAssignableInstance,
    getAssignableInstance,
    removeAssignableInstance,
    updateAssignableInstance,
  } = services.assignableInstances;

  const { createAssignation, getAssignation, updateAssignation } = services.assignations;

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
    asset: {
      name: 'preTask Name - Los Romanos',
      cover:
        'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.MDtnZnjX1nSoMUc1vEQl0QHaEK%26pid%3DApi&f=1',
      color: '#ff0000',
      description: 'This is the description of the pretask',
      tags: ['tag1', 'tag2'],
      indexable: true,
      public: true,
    },
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
    asset: {
      name: 'Task Name - Los Romanos',
      cover:
        'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.MDtnZnjX1nSoMUc1vEQl0QHaEK%26pid%3DApi&f=1',
      color: '#ff0000',
      description: 'This is the description of the task',
      tags: ['tag1', 'tag2'],
      indexable: true,
      public: true,
    },
    // name: 'Task Name - Los Romanos',
    // cover: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.MDtnZnjX1nSoMUc1vEQl0QHaEK%26pid%3DApi&f=1',
    // color: '#ff0000',
    // description: 'This is the description of the task',
    // tags: ['tag1', 'tag2'],
    // indexable: true,
    // public: true,
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
    // await registerRole('pretask', { transacting });

    // EN: Create the assignable
    // ES: Crea el asignable

    // preTask
    // const { id: preTaskId } = await createAssignable(preTask, { userSession, transacting });
    // task
    const data = await createAssignable(
      {
        ...task,
        // relatedAssignables: {
        //   ...task.relatedAssignables,
        //   before: [
        //     {
        //       id: preTaskId,
        //       type: 'preTask',
        //       conditionsToPass: [
        //         { type: 'grade', minGrade: 5 },
        //         { type: 'pass' },
        //         { type: 'time', minTime: '10 minutes', maxTime: '15 minutes' },
        //       ],
        //       conditionsToDo: [],
        //       maxRetries: 3,
        //     },
        //   ],
        // },
      },
      { userSession, transacting }
    );
    const { id } = data;

    // EN: Create the task instance
    // ES: Crea la instancia de la tarea
    const taskInstanceData = await createAssignableInstance(
      {
        assignable: id,
        ...taskInstance,
      },
      { userSession, transacting }
    );

    // // EN: Create the assignation
    // // ES: Crea la asignación
    // const userAssignationData = await createAssignation(
    //   taskInstanceData.id,
    //   [userSession.userAgents[0].id],
    //   {
    //     indexable: false,
    //     classes: ['5c1a0489-8e1d-4ba2-ac0d-d195144f1507'],
    //     group: null,
    //     grades: [
    //       {
    //         subject: 'bf9f8f8f-8f8f-8f8f-8f8f-8f8f8f8f8f8f',
    //         type: 'main',
    //         grade: '5c1a0489-8e1d-4ba2-ac0d-d195144f1507',
    //         gradedBy: '5c1a0489-8e1d-4ba2-ac0d-d195144f1507',
    //         feedback: '<p>This is the feedback</p>',
    //       },
    //     ],
    //     timestamps: {
    //       opened: new Date('2019-01-01T00:00:00.000Z'),
    //     },
    //     status: 'opened',
    //     metadata: { invented: true },
    //   },
    //   { userSession, transacting }
    // );

    // console.log('assignation', userAssignationData);

    // EN: Update the assignation
    // ES: Actualiza la asignación
    // const updatedAssignation = await updateAssignation({
    //   id: userAssignationData.id,
    //   grades: [
    //     {
    //       subject: 'bf9f8f8f-8f8f-8f8f-8f8f-8f8f8f8f8f8f',
    //       type: 'main',
    //       grade: '5c1a0489-8e1d-4ba2-ac0d-d195144f1509',
    //       gradedBy: '5c1a0489-8e1d-4ba2-ac0d-d195144f1509',
    //       feedback: '<p>This is the feedback (Not changed)</p>',
    //     },
    //   ],
    //   timestamps: {
    //     closed: new Date('2019-01-01T00:00:00.000Z'),
    //   },
    // });

    // console.log('UpdatedAssignation', updatedAssignation);

    // EN: Remove the assignation
    // ES: Elimina la asignación

    const removed = await removeAssignable(id, { userSession, transacting });

    console.log('removed', removed);

    throw new Error('cleanup');
  }, assignables);
};

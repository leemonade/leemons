const _ = require('lodash');

async function add({ student, teachers, classe, ctx }) {
  const key = ctx.prefixPN(`room.class.${classe.id}.student.${student.student}.teachers`);
  const roomExists = await ctx.tx.call('comunica.room.exists', {
    key,
  });
  if (!roomExists) {
    const roomData = {
      name: `roomCard.teachers`,
      type: ctx.prefixPN('class.student-teachers'),
      bgColor: classe.subject.color,
      image: null,
      icon: null,
      parentRoom: [
        ctx.prefixPN(`room.class.group.${classe.id}`),
        `comunica.room.chat.parent.${student.student}`,
      ],
      program: classe.program.id,
    };

    await ctx.tx.call('comunica.room.add', {
      key,
      ...roomData,
    });
  }

  await ctx.tx.call('comunica.room.addUserAgents', {
    key,
    userAgents: _.map(teachers, 'teacher').concat([student.student]),
  });
}

async function addComunicaRoomsBetweenStudentsAndTeachers({ classe, ctx }) {
  const [students, teachers] = await Promise.all([
    ctx.tx.db.ClassStudent.find({ class: classe.id }).lean(),
    ctx.tx.db.ClassTeacher.find({ class: classe.id }).lean(),
  ]);

  return Promise.all(_.map(students, (student) => add({ student, teachers, classe, ctx })));
}

module.exports = { addComunicaRoomsBetweenStudentsAndTeachers };

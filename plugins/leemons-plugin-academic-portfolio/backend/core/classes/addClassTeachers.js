const { LeemonsError } = require('@leemons/error');
const _ = require('lodash');

const { validateAddClassTeachers } = require('../../validations/forms');

const {
  addComunicaRoomsBetweenStudentsAndTeachers,
} = require('./addComunicaRoomsBetweenStudentsAndTeachers');
const { classByIds } = require('./classByIds');
const { add: addTeacher } = require('./teacher/add');

async function getClass({ classId, ctx }) {
  const classes = await classByIds({ ids: classId, ctx });
  return classes?.[0];
}

async function addClassTeachers({ data, ctx }) {
  validateAddClassTeachers(data);

  const classId = data.class;
  const _class = await getClass({ classId, ctx });

  const hasMainTeacher = !!_.find(_class.teachers, { type: 'main-teacher' });
  const newHasMainTeacher = !!_.find(data.teachers, { type: 'main-teacher' });

  if (hasMainTeacher && newHasMainTeacher) {
    throw new LeemonsError(ctx, { message: 'The class already has a lead teacher' });
  }

  const classTeacherIds = _.map(_class.teachers, 'teacher');

  const promises = [];
  _.forEach(data.teachers, ({ teacher, type }) => {
    if (classTeacherIds.indexOf(teacher) < 0)
      promises.push(addTeacher({ class: data.class, teacher, type, ctx }));
  });

  await Promise.all(promises);

  const classe = await getClass({ classId, ctx });
  await addComunicaRoomsBetweenStudentsAndTeachers({ classe, ctx });

  return classe;
}

module.exports = { addClassTeachers };

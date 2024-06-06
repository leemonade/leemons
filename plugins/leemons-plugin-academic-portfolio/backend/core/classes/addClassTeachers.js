const _ = require('lodash');
const { LeemonsError } = require('@leemons/error');
const { validateAddClassTeachers } = require('../../validations/forms');
const { classByIds } = require('./classByIds');
const { add: addTeacher } = require('./teacher/add');
const {
  addComunicaRoomsBetweenStudentsAndTeachers,
} = require('./addComunicaRoomsBetweenStudentsAndTeachers');

async function addClassTeachers({ data, ctx }) {
  validateAddClassTeachers(data);

  const getClass = async () => (await classByIds({ ids: data.class, ctx }))[0];

  const _class = await getClass();

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

  const classe = (await classByIds({ ids: data.class, ctx }))[0];
  await addComunicaRoomsBetweenStudentsAndTeachers({ classe, ctx });

  return getClass();
}

module.exports = { addClassTeachers };

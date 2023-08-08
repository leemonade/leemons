const { LeemonsError } = require('leemons-error');
const { validateAddInstanceClass } = require('../../validations/forms');
const { add: addCourse } = require('./course/add');
const { add: addGroup } = require('./group/add');
const { existCourseInProgram } = require('../courses/existCourseInProgram');
const { existGroupInProgram } = require('../groups/existGroupInProgram');
const { classByIds } = require('./classByIds');
const { setSubjectCredits } = require('../subjects/setSubjectCredits');
const { setSubjectInternalId } = require('../subjects/setSubjectInternalId');

async function addInstanceClass({ data, ctx }) {
  await validateAddInstanceClass({ data, ctx });
  const { internalIdCourse, internalId, credits, course, group, ...rest } = data;
  // ES: Creamos la clase
  const nClass = await ctx.tx.db.Class.create(rest);

  const pClass = (await classByIds({ ids: nClass.class, ctx }))[0];

  const getParentClass = (cl) => {
    if (cl.parentClass) {
      return getParentClass(cl.parentClass);
    }
    return cl;
  };

  const parentClass = getParentClass(pClass);

  // ES: Añadimos todas las relaciones de la clase
  if (course) {
    // ES: Comprobamos que todos los cursos existen y pertenecen al programa
    if (!(await existCourseInProgram({ id: course, program: nClass.program, ctx }))) {
      throw new LeemonsError(ctx, { message: 'course not in program' });
    }
    await addCourse({ class: nClass.id, course, ctx });
  }
  if (group) {
    // ES: Comprobamos que todos los cursos existen y pertenecen al programa
    if (!(await existGroupInProgram({ id: group, program: nClass.program, ctx }))) {
      throw new LeemonsError(ctx, { message: 'group not in program' });
    }
    await addGroup({ class: nClass.id, group, ctx });
  }

  // ES: Seteamos los creditos a la asignatura para el programa en el que estamos creando la asignatura
  if (credits) {
    await setSubjectCredits({
      subject: parentClass.subject.id,
      program: nClass.program,
      credits,
      ctx,
    });
  }

  // Creamos el internal id de la asignatura para este programa
  if (internalId) {
    await setSubjectInternalId({
      subject: parentClass.subject.id,
      program: nClass.program,
      internalId,
      course: internalIdCourse,
      ctx,
    });
  }

  return (await classByIds({ ids: nClass.id, ctx }))[0];
}

module.exports = { addInstanceClass };

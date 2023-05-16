const _ = require('lodash');
const { table } = require('../tables');
const { validateAddInstanceClass } = require('../../validations/forms');
const { add: addCourse } = require('./course/add');
const { add: addGroup } = require('./group/add');
const { existCourseInProgram } = require('../courses/existCourseInProgram');
const { existGroupInProgram } = require('../groups/existGroupInProgram');
const { classByIds } = require('./classByIds');
const { setSubjectCredits } = require('../subjects/setSubjectCredits');
const { setSubjectInternalId } = require('../subjects/setSubjectInternalId');

async function addInstanceClass(data, { transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      await validateAddInstanceClass(data, { transacting });
      const { internalIdCourse, internalId, credits, course, group, ...rest } = data;
      // ES: Creamos la clase
      const nClass = await table.class.create(rest, { transacting });

      const pClass = (await classByIds(nClass.class, { transacting }))[0];

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
        if (!(await existCourseInProgram(course, nClass.program, { transacting }))) {
          throw new Error('course not in program');
        }
        await addCourse(nClass.id, course, { transacting });
      }
      if (group) {
        // ES: Comprobamos que todos los cursos existen y pertenecen al programa
        if (!(await existGroupInProgram(group, nClass.program, { transacting }))) {
          throw new Error('group not in program');
        }
        await addGroup(nClass.id, group, { transacting });
      }

      // ES: Seteamos los creditos a la asignatura para el programa en el que estamos creando la asignatura
      if (credits) {
        await setSubjectCredits(parentClass.subject.id, nClass.program, credits, { transacting });
      }

      // Creamos el internal id de la asignatura para este programa
      if (internalId) {
        await setSubjectInternalId(parentClass.subject.id, nClass.program, internalId, {
          course: internalIdCourse,
          transacting,
        });
      }

      return (await classByIds(nClass.id, { transacting }))[0];
    },
    table.groups,
    _transacting
  );
}

module.exports = { addInstanceClass };

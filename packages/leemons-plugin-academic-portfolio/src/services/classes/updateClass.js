const _ = require('lodash');
const { table } = require('../tables');
const { validateUpdateClass } = require('../../validations/forms');
const { existKnowledgeInProgram } = require('../knowledges/existKnowledgeInProgram');
const { add: addKnowledge } = require('./knowledge/add');
const { removeByClass: removeKnowledgeByClass } = require('./knowledge/removeByClass');
const { existSubstageInProgram } = require('../substages/existSubstageInProgram');
const { add: addSubstage } = require('./substage/add');
const { removeByClass: removeSubstageByClass } = require('./substage/removeByClass');
const { existCourseInProgram } = require('../courses/existCourseInProgram');
const { add: addCourse } = require('./course/add');
const { removeByClass: removeCourseByClass } = require('./course/removeByClass');
const { existGroupInProgram } = require('../groups/existGroupInProgram');
const { add: addGroup } = require('./group/add');
const { removeByClass: removeGroupByClass } = require('./group/removeByClass');
const { add: addTeacher } = require('./teacher/add');
const { removeByClass: removeTeachersByClass } = require('./teacher/removeByClass');
const { classByIds } = require('./classByIds');

async function updateClass(data, { transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      await validateUpdateClass(data, { transacting });
      const { id, course, group, knowledge, substage, teachers, ...rest } = data;
      // ES: Creamos la clase
      const nClass = await table.class.update({ id }, rest, { transacting });
      // ES: Añadimos todas las relaciones de la clase

      if (_.isNull(knowledge) || knowledge)
        await removeKnowledgeByClass(nClass.id, { transacting });
      if (knowledge) {
        // ES: Comprobamos que todos los conocimientos existen y pertenecen al programa
        if (!(await existKnowledgeInProgram(knowledge, nClass.program, { transacting }))) {
          throw new Error('knowledge not in program');
        }
        await addKnowledge(nClass.id, knowledge, { transacting });
      }
      if (_.isNull(substage) || substage) await removeSubstageByClass(nClass.id, { transacting });
      if (substage) {
        // ES: Comprobamos que todos los substages existen y pertenecen al programa
        if (!(await existSubstageInProgram(substage, nClass.program, { transacting }))) {
          throw new Error('substage not in program');
        }
        await addSubstage(nClass.id, substage, { transacting });
      }
      if (_.isNull(course) || course) await removeCourseByClass(nClass.id, { transacting });
      if (course) {
        // ES: Comprobamos que todos los cursos existen y pertenecen al programa
        if (!(await existCourseInProgram(course, nClass.program, { transacting }))) {
          throw new Error('course not in program');
        }
        await addCourse(nClass.id, course, { transacting });
      }
      if (_.isNull(group) || group) await removeGroupByClass(nClass.id, { transacting });
      if (group) {
        // ES: Comprobamos que todos los cursos existen y pertenecen al programa
        if (!(await existGroupInProgram(group, nClass.program, { transacting }))) {
          throw new Error('group not in program');
        }
        await addGroup(nClass.id, group, { transacting });
      }
      if (_.isNull(group) || teachers) await removeTeachersByClass(nClass.id, { transacting });
      if (teachers)
        await Promise.all(
          _.map(teachers, ({ teacher, type }) =>
            addTeacher(nClass.id, teacher, type, { transacting })
          )
        );

      // ES: Cambiamos el resto de clases que tengan esta asignatura y le seteamos el mismo tipo de asignatura
      await table.class.update(
        { subject: nClass.subject },
        { subjectType: nClass.subjectType },
        { transacting }
      );

      return (await classByIds(nClass.id, { transacting }))[0];
    },
    table.groups,
    _transacting
  );
}

module.exports = { updateClass };

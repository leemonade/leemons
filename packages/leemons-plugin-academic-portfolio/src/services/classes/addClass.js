const _ = require('lodash');
const { isArray, map } = require('lodash');
const { table } = require('../tables');
const { validateAddClass } = require('../../validations/forms');
const { add: addKnowledge } = require('./knowledge/add');
const { add: addSubstage } = require('./substage/add');
const { add: addTeacher } = require('./teacher/add');
const { add: addCourse } = require('./course/add');
const { add: addGroup } = require('./group/add');
const { existKnowledgeInProgram } = require('../knowledges/existKnowledgeInProgram');
const { existSubstageInProgram } = require('../substages/existSubstageInProgram');
const { existCourseInProgram } = require('../courses/existCourseInProgram');
const { existGroupInProgram } = require('../groups/existGroupInProgram');
const { classByIds } = require('./classByIds');
const { processScheduleForClass } = require('./processScheduleForClass');
const { changeBySubject } = require('./knowledge/changeBySubject');

async function addClass(data, { transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      await validateAddClass(data, { transacting });
      const { course, group, knowledge, substage, teachers, schedule, ...rest } = data;
      // ES: Creamos la clase
      const nClass = await table.class.create(rest, { transacting });
      // ES: Añadimos todas las relaciones de la clase

      if (knowledge) {
        // ES: Comprobamos que todos los conocimientos existen y pertenecen al programa
        if (!(await existKnowledgeInProgram(knowledge, nClass.program, { transacting }))) {
          throw new Error('knowledge not in program');
        }
        await addKnowledge(nClass.id, knowledge, { transacting });
      }
      if (substage) {
        // ES: Comprobamos que todos los substages existen y pertenecen al programa
        if (!(await existSubstageInProgram(substage, nClass.program, { transacting }))) {
          throw new Error('substage not in program');
        }
        await addSubstage(nClass.id, substage, { transacting });
      }
      if (course) {
        // ES: Comprobamos que todos los cursos existen y pertenecen al programa
        if (!(await existCourseInProgram(course, nClass.program, { transacting }))) {
          throw new Error('course not in program');
        }
        const courses = isArray(course) ? course : [course];
        await Promise.all(map(courses, (c) => addCourse(nClass.id, c, { transacting })));
      }
      if (group) {
        // ES: Comprobamos que todos los cursos existen y pertenecen al programa
        if (!(await existGroupInProgram(group, nClass.program, { transacting }))) {
          throw new Error('group not in program');
        }
        await addGroup(nClass.id, group, { transacting });
      }
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

      // ES: Cambiamos el resto de clases que tengan esta asignatura y le seteamos el mismo knowledge
      await changeBySubject(nClass.subject, knowledge, { transacting });

      if (schedule) {
        await processScheduleForClass(schedule, nClass.id, { transacting });
      }

      const classe = (await classByIds(nClass.id, { transacting }))[0];
      await leemons.events.emit('after-add-class', { class: classe, transacting });
      return classe;
    },
    table.groups,
    _transacting
  );
}

module.exports = { addClass };

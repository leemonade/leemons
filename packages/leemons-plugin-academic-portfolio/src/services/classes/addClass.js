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
const { setToAllClassesWithSubject } = require('./course/setToAllClassesWithSubject');
const { isUsedInSubject } = require('./group/isUsedInSubject');

async function addClass(data, { transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      await validateAddClass(data, { transacting });
      const { course, group, knowledge, substage, teachers, schedule, ...rest } = data;
      // ES: Creamos la clase
      const nClass = await table.class.create(rest, { transacting });
      // ES: Añadimos todas las relaciones de la clase

      const promises = [];

      if (knowledge) {
        // ES: Comprobamos que todos los conocimientos existen y pertenecen al programa
        if (!(await existKnowledgeInProgram(knowledge, nClass.program, { transacting }))) {
          throw new Error('knowledge not in program');
        }
        promises.push(addKnowledge(nClass.id, knowledge, { transacting }));
      }
      if (substage) {
        // ES: Comprobamos que todos los substages existen y pertenecen al programa
        if (!(await existSubstageInProgram(substage, nClass.program, { transacting }))) {
          throw new Error('substage not in program');
        }
        promises.push(addSubstage(nClass.id, substage, { transacting }));
      }
      if (course) {
        // ES: Comprobamos que todos los cursos existen y pertenecen al programa
        if (!(await existCourseInProgram(course, nClass.program, { transacting }))) {
          throw new Error('course not in program');
        }
        const courses = isArray(course) ? course : [course];
        promises.push(
          Promise.all([
            Promise.all(map(courses, (c) => addCourse(nClass.id, c, { transacting }))),
            setToAllClassesWithSubject(nClass.subject, courses, { transacting }),
          ])
        );
      }
      if (group) {
        // ES: Comprobamos que todos los grupos existen y pertenecen al programa
        if (!(await existGroupInProgram(group, nClass.program, { transacting }))) {
          throw new Error('group not in program');
        }
        if (await isUsedInSubject(nClass.subject, group, { classe: nClass.id, transacting })) {
          throw new Error('group is already used in subject');
        }
        promises.push(addGroup(nClass.id, group, { transacting }));
      }
      if (teachers)
        promises.push(
          Promise.all(
            _.map(teachers, ({ teacher, type }) =>
              addTeacher(nClass.id, teacher, type, { transacting })
            )
          )
        );

      // ES: Cambiamos el resto de clases que tengan esta asignatura y le seteamos el mismo tipo de asignatura
      promises.push(
        table.class.updateMany(
          { subject: nClass.subject },
          { subjectType: nClass.subjectType },
          { transacting }
        )
      );

      promises.push(
        leemons.getPlugin('users').services.permissions.addItem(
          nClass.id,
          'plugins.academic-portfolio.class',
          {
            permissionName: `plugins.academic-portfolio.class.${nClass.id}`,
            actionNames: ['view'],
          },
          { isCustomPermission: true, transacting }
        )
      );

      // ES: Cambiamos el resto de clases que tengan esta asignatura y le seteamos el mismo knowledge
      promises.push(changeBySubject(nClass.subject, knowledge, { transacting }));

      if (schedule) {
        promises.push(processScheduleForClass(schedule, nClass.id, { transacting }));
      }

      await Promise.all(promises);

      const classe = (await classByIds(nClass.id, { transacting }))[0];
      await leemons.events.emit('after-add-class', { class: classe, transacting });
      return classe;
    },
    table.groups,
    _transacting
  );
}

module.exports = { addClass };

const _ = require('lodash');
const { isArray } = require('lodash');
const { table } = require('../tables');
const { validateUpdateClass } = require('../../validations/forms');
const { existKnowledgeInProgram } = require('../knowledges/existKnowledgeInProgram');
const { add: addKnowledge } = require('./knowledge/add');
const { removeByClass: removeKnowledgeByClass } = require('./knowledge/removeByClass');
const { existSubstageInProgram } = require('../substages/existSubstageInProgram');
const { add: addSubstage } = require('./substage/add');
const { removeByClass: removeSubstageByClass } = require('./substage/removeByClass');
const { existCourseInProgram } = require('../courses/existCourseInProgram');
const { removeByClass: removeCourseByClass } = require('./course/removeByClass');
const { existGroupInProgram } = require('../groups/existGroupInProgram');
const { add: addGroup } = require('./group/add');
const { removeByClass: removeGroupByClass } = require('./group/removeByClass');
const { add: addTeacher } = require('./teacher/add');
const { removeByClass: removeTeachersByClass } = require('./teacher/removeByClass');
const { classByIds } = require('./classByIds');
const { processScheduleForClass } = require('./processScheduleForClass');
const { changeBySubject } = require('./knowledge/changeBySubject');
const { setToAllClassesWithSubject } = require('./course/setToAllClassesWithSubject');
const { isUsedInSubject } = require('./group/isUsedInSubject');

async function updateClass(data, { userSession, transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      await validateUpdateClass(data, { transacting });

      let goodGroup = null;

      const cClass = await table.class.findOne(
        { id: data.id },
        { columns: ['program'], transacting }
      );

      const program = await table.programs.findOne(
        { id: cClass.program },
        { columns: ['id', 'useOneStudentGroup'], transacting }
      );

      if (program.useOneStudentGroup) {
        const group = await table.groups.findOne(
          {
            isAlone: true,
            type: 'group',
            program: program.id,
          },
          { columns: ['id'], transacting }
        );
        goodGroup = group.id;
      }

      const { id, course, group, knowledge, substage, teachers, schedule, icon, image, ...rest } =
        data;

      if (!goodGroup && group) {
        goodGroup = group;
      }

      // ES: Actualizamos la clase
      let nClass = await table.class.update({ id }, rest, { transacting });

      // ES: Añadimos el asset de la imagen
      const imageData = {
        indexable: true,
        public: true, // TODO Cambiar a false despues de hacer la demo
        name: nClass.id,
      };
      if (image) imageData.cover = image;
      const assetService = leemons.getPlugin('leebrary').services.assets;
      const assetImage = await assetService.update(
        { id: nClass.image, ...imageData },
        {
          published: true,
          userSession,
          transacting,
        }
      );
      nClass = await table.class.update(
        { id: nClass.id },
        {
          image: assetImage.id,
        },
        { transacting }
      );
      const promises = [];
      // ES: Añadimos todas las relaciones de la clase

      if (_.isNull(knowledge) || knowledge)
        await removeKnowledgeByClass(nClass.id, { transacting });
      if (knowledge) {
        // ES: Comprobamos que todos los conocimientos existen y pertenecen al programa
        if (!(await existKnowledgeInProgram(knowledge, nClass.program, { transacting }))) {
          throw new Error('knowledge not in program');
        }
        promises.push(addKnowledge(nClass.id, knowledge, { transacting }));
      }

      if (_.isNull(substage) || substage) await removeSubstageByClass(nClass.id, { transacting });
      if (substage) {
        // ES: Comprobamos que todos los substages existen y pertenecen al programa
        if (!(await existSubstageInProgram(substage, nClass.program, { transacting }))) {
          throw new Error('substage not in program');
        }
        promises.push(addSubstage(nClass.id, substage, { transacting }));
      }

      if (_.isNull(course) || course) {
        await Promise.all([
          removeCourseByClass(nClass.id, { transacting }),
          setToAllClassesWithSubject(nClass.subject, [], { transacting }),
        ]);
      }
      if (course) {
        // ES: Comprobamos que todos los cursos existen y pertenecen al programa
        if (!(await existCourseInProgram(course, nClass.program, { transacting }))) {
          throw new Error('course not in program');
        }
        const courses = isArray(course) ? course : [course];
        promises.push(setToAllClassesWithSubject(nClass.subject, courses, { transacting }));
      }

      if (_.isNull(goodGroup) || goodGroup) await removeGroupByClass(nClass.id, { transacting });
      if (goodGroup) {
        // ES: Comprobamos que todos los cursos existen y pertenecen al programa
        if (!(await existGroupInProgram(goodGroup, nClass.program, { transacting }))) {
          throw new Error('group not in program');
        }
        if (await isUsedInSubject(nClass.subject, goodGroup, { classe: nClass.id, transacting })) {
          throw new Error('group is already used in subject');
        }
        promises.push(addGroup(nClass.id, goodGroup, { transacting }));
      }

      if (_.isNull(goodGroup) || teachers) await removeTeachersByClass(nClass.id, { transacting });

      if (teachers)
        await Promise.all(
          _.map(teachers, ({ teacher, type }) =>
            addTeacher(nClass.id, teacher, type, { transacting })
          )
        );

      // ES: Cambiamos el resto de clases que tengan esta asignatura y le seteamos el mismo tipo de asignatura
      promises.push(
        table.class.updateMany(
          { subject: nClass.subject },
          { subjectType: nClass.subjectType, color: nClass.color },
          { transacting }
        )
      );

      // ES: Cambiamos el resto de clases que tengan esta asignatura y le seteamos el mismo knowledge
      promises.push(changeBySubject(nClass.subject, knowledge, { transacting }));

      promises.push(await processScheduleForClass(schedule, nClass.id, { transacting }));

      await Promise.all(promises);

      const classe = (await classByIds(nClass.id, { transacting }))[0];

      await leemons.events.emit('after-update-class', { class: classe, transacting });

      return classe;
    },
    table.class,
    _transacting
  );
}

module.exports = { updateClass };

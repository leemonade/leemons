/* eslint-disable no-param-reassign */
const _ = require('lodash');
const { table } = require('../tables');
const { classByIds } = require('./classByIds');
const { duplicateByClass: duplicateKnowledgeByClass } = require('./knowledge/duplicateByClass');
const { duplicateByClass: duplicateSubstageByClass } = require('./substage/duplicateByClass');
const { duplicateByClass: duplicateStudentsByClass } = require('./student/duplicateByClass');
const { duplicateByClass: duplicateTeachersByClass } = require('./teacher/duplicateByClass');
const { duplicateByClass: duplicateCourseByClass } = require('./course/duplicateByClass');
const { duplicateByClass: duplicateGroupByClass } = require('./group/duplicateByClass');
const { addClassStudentsMany } = require('./addClassStudentsMany');

async function duplicateClassesByIds(
  ids,
  {
    duplications: dup = {},
    students = false,
    teachers = false,
    groups = false,
    courses = false,
    substages = false,
    knowledges = false,
    userSession,
    transacting: _transacting,
  } = {}
) {
  const assetService = leemons.getPlugin('leebrary').services.assets;

  const duplications = dup;
  return global.utils.withTransaction(
    async (transacting) => {
      const [classes, rawClasses] = await Promise.all([
        classByIds(ids, { transacting }),
        table.class.find({ id_$in: _.isArray(ids) ? ids : [ids] }, { transacting }),
      ]);
      const classesIds = _.map(classes, 'id');
      await leemons.events.emit('before-duplicate-classes', { classes, transacting });

      // ES: Empezamos la duplicación de los items
      // EN: Start the duplication of the items
      const newClasses = await Promise.all(
        _.map(rawClasses, async ({ id, image, ...item }) => {
          if (image) {
            image = await assetService.duplicate(image, { userSession, transacting });
            image = image.id;
          }
          return table.class.create(
            {
              ...item,
              image,
              program:
                duplications.programs && duplications.programs[item.program]
                  ? duplications.programs[item.program].id
                  : item.program,
              subjectType:
                duplications.subjectTypes && duplications.subjectTypes[item.subjectType]
                  ? duplications.subjectTypes[item.subjectType].id
                  : item.subjectType,
              subject:
                duplications.subjects && duplications.subjects[item.subject]
                  ? duplications.subjects[item.subject].id
                  : item.subject,
            },
            { transacting }
          );
        })
      );

      // ES: Añadimos los items duplicados de tal forma que el indice es el id original y el valor es el nuevo item duplicado
      // EN: Add the duplicated items in such a way that the index is the original id and the value is the new duplicated item
      if (!_.isObject(duplications.classes)) duplications.classes = {};
      _.forEach(rawClasses, ({ id }, index) => {
        duplications.classes[id] = newClasses[index];
      });

      if (knowledges) await duplicateKnowledgeByClass(classesIds, { duplications, transacting });
      if (substages) await duplicateSubstageByClass(classesIds, { duplications, transacting });
      if (courses) await duplicateCourseByClass(classesIds, { duplications, transacting });
      if (groups) await duplicateGroupByClass(classesIds, { duplications, transacting });

      await Promise.all(
        _.map(newClasses, async (nClass) => {
          const classe = (await classByIds(nClass.id, { transacting }))[0];
          await leemons.events.emit('after-add-class', { class: classe, transacting });
        })
      );

      if (students) {
        if (_.isBoolean(students)) {
          await duplicateStudentsByClass(classesIds, { duplications, students, transacting });
        } else {
          await addClassStudentsMany({ class: _.map(newClasses, 'id'), students }, { transacting });
        }
      }
      if (teachers) await duplicateTeachersByClass(classesIds, { duplications, transacting });

      await leemons.events.emit('after-duplicate-classes', {
        classes,
        duplications: duplications.classes,
        transacting,
      });
      return duplications;
    },
    table.class,
    _transacting
  );
}

module.exports = { duplicateClassesByIds };

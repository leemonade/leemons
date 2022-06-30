const _ = require('lodash');
const { table } = require('../tables');
const { classByIds } = require('./classByIds');
const { duplicateByClass: duplicateKnowledgeByClass } = require('./knowledge/duplicateByClass');
const { duplicateByClass: duplicateSubstageByClass } = require('./substage/duplicateByClass');
const { duplicateByClass: duplicateStudentsByClass } = require('./student/duplicateByClass');
const { duplicateByClass: duplicateTeachersByClass } = require('./teacher/duplicateByClass');
const { duplicateByClass: duplicateCourseByClass } = require('./course/duplicateByClass');
const { duplicateByClass: duplicateGroupByClass } = require('./group/duplicateByClass');

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
    transacting: _transacting,
  } = {}
) {
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
        _.map(rawClasses, ({ id, ...item }) =>
          table.class.create(
            {
              ...item,
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
          )
        )
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
      if (students) await duplicateStudentsByClass(classesIds, { duplications, transacting });
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

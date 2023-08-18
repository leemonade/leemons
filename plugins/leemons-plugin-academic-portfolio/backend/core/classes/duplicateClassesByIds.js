/* eslint-disable no-param-reassign */
const _ = require('lodash');
const { classByIds } = require('./classByIds');
const { duplicateByClass: duplicateKnowledgeByClass } = require('./knowledge/duplicateByClass');
const { duplicateByClass: duplicateSubstageByClass } = require('./substage/duplicateByClass');
const { duplicateByClass: duplicateStudentsByClass } = require('./student/duplicateByClass');
const { duplicateByClass: duplicateTeachersByClass } = require('./teacher/duplicateByClass');
const { duplicateByClass: duplicateCourseByClass } = require('./course/duplicateByClass');
const { duplicateByClass: duplicateGroupByClass } = require('./group/duplicateByClass');
const { addClassStudentsMany } = require('./addClassStudentsMany');
const { processScheduleForClass } = require('./processScheduleForClass');
const { getClassesProgramInfo } = require('./listSessionClasses');

async function duplicateClassesByIds({
  ids,
  duplications: dup = {},
  students = false,
  teachers = false,
  groups = false,
  courses = false,
  substages = false,
  knowledges = false,
  ctx,
}) {
  const duplications = dup;
  const [classes, rawClasses] = await Promise.all([
    classByIds({ ids, ctx }),
    ctx.tx.db.Class.find({ id: _.isArray(ids) ? ids : [ids] }).lean(),
    ctx.tx.call('timetable.timetable.listByClassIds', {
      classIds: ids,
    }),
  ]);
  const classesById = _.keyBy(classes, 'id');
  const classesIds = _.map(classes, 'id');
  await ctx.tx.emit('before-duplicate-classes', { classes });

  // ES: Empezamos la duplicación de los items
  // EN: Start the duplication of the items
  const newClasses = await Promise.all(
    _.map(rawClasses, async ({ id, image, ...item }) => {
      if (image) {
        image = await ctx.tx.call('leebrary.assets.duplicate', {
          assetId: image,
        });
        image = image.id;
      }
      const newClass = await ctx.tx.db.Class.create({
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
      });

      if (classesById[id].schedule) {
        await processScheduleForClass(
          _.map(classesById[id].schedule, ({ id: _id, deleted, class: classe, ...e }) => e),
          newClass.id
        );
      }

      return newClass;
    })
  );

  // ES: Añadimos los items duplicados de tal forma que el indice es el id original y el valor es el nuevo item duplicado
  // EN: Add the duplicated items in such a way that the index is the original id and the value is the new duplicated item
  if (!_.isObject(duplications.classes)) duplications.classes = {};
  _.forEach(rawClasses, ({ id }, index) => {
    duplications.classes[id] = newClasses[index];
  });

  if (knowledges) await duplicateKnowledgeByClass({ classIds: classesIds, duplications, ctx });
  if (substages) await duplicateSubstageByClass({ classIds: classesIds, duplications, ctx });
  if (courses) await duplicateCourseByClass({ classIds: classesIds, duplications, ctx });
  if (groups) await duplicateGroupByClass({ classIds: classesIds, duplications, ctx });

  await Promise.all(
    _.map(newClasses, async (nClass) => {
      let classe = (await classByIds({ ids: nClass.id, ctx }))[0];
      [classe] = await getClassesProgramInfo({
        programs: classe.program,
        classes: [classe],
        ctx,
      });
      await ctx.tx.emit('after-add-class', { class: classe });
    })
  );

  if (students) {
    if (_.isBoolean(students)) {
      await duplicateStudentsByClass({ classIds: classesIds, duplications, ctx });
    } else {
      await addClassStudentsMany({ data: { class: _.map(newClasses, 'id'), students }, ctx });
    }
  }
  if (teachers) await duplicateTeachersByClass({ classIds: classesIds, duplications, ctx });

  await ctx.tx.emit('after-duplicate-classes', {
    classes,
    duplications: duplications.classes,
  });
  return duplications;
}

module.exports = { duplicateClassesByIds };

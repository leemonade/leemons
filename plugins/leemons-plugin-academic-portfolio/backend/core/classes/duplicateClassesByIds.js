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
    _.map(rawClasses, async ({ id, _id, __v, updatedAt, createdAt, image, ...item }) => {
      if (image) {
        image = await ctx.tx.call('leebrary.assets.duplicate', {
          assetId: image,
        });
        image = image.id;
      }
      const newClass = await ctx.tx.db.Class.create({
        ...item,
        image,
        program: duplications.programs?.[item.program]
          ? duplications.programs[item.program].id
          : item.program,
        subjectType: duplications.subjectTypes?.[item.subjectType]
          ? duplications.subjectTypes[item.subjectType].id
          : item.subjectType,
        subject: duplications.subjects?.[item.subject]
          ? duplications.subjects[item.subject].id
          : item.subject,
      }).then((mongooseDoc) => mongooseDoc.toObject());

      if (classesById[id].schedule) {
        await processScheduleForClass({
          schedule: _.map(
            classesById[id].schedule,
            ({ id: _ID, deleted, class: classe, ...e }) => e
          ),
          classId: newClass.id,
          ctx,
        });
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

  // Add new classes custom permission
  await Promise.all(
    _.map(newClasses, async (nClass) => {
      ctx.tx.call('users.permissions.addItem', {
        item: nClass.id,
        type: 'academic-portfolio.class',
        data: {
          permissionName: `academic-portfolio.class.${nClass.id}`,
          actionNames: ['view'],
        },
        isCustomPermission: true,
      });
    })
  );

  await Promise.all(
    _.map(newClasses, async (nClass) => {
      const classe = (await classByIds({ ids: nClass.id, ctx }))[0];
      const classProgram = await ctx.tx.db.Programs.findOne({ id: classe.program }).lean();
      const programCenter = await ctx.tx.db.ProgramCenter.findOne({
        program: classProgram.id,
      }).lean();
      let subName = classProgram.name;
      if (classe.groups?.abbreviation) {
        subName += ` - ${classe.groups.abbreviation}`;
      }
      const roomData = {
        name: classe.subject.name,
        // name: `${classe.subject.name} ${subName}`,
        type: ctx.prefixPN('class.group'),
        subName,
        bgColor: classe.subject.color,
        image: null,
        icon: '/public/academic-portfolio/subject-icon.svg', // Default
        program: classProgram.id,
        center: programCenter.center,
        metadata: {
          iconIsUrl: true,
        },
      };
      if (classe.subject.icon?.cover) {
        roomData.icon = classe.subject.icon.id;
        delete roomData.metadata.iconIsUrl;
      }
      if (classe.subject.image?.cover) {
        roomData.image = classe.subject.image.id;
      }
      // if (newClasses.image) {
      //   roomData.image = newClasses.image;
      // }

      await ctx.tx.call('comunica.room.add', {
        key: ctx.prefixPN(`room.class.group.${nClass.id}`),
        ...roomData,
      });

      await ctx.tx.call('comunica.room.add', {
        ...roomData,
        type: ctx.prefixPN('class'),
        key: ctx.prefixPN(`room.class.${nClass.id}`),
        parentRoom: ctx.prefixPN(`room.class.group.${nClass.id}`),
        icon: '/public/academic-portfolio/class-icon.svg',
      });
    })
  );

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

const _ = require('lodash');
const { LeemonsError } = require('@leemons/error');
const { isArray, map } = require('lodash');
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
const { getClassesProgramInfo } = require('./listSessionClasses');
const { getProgramCourses } = require('../programs/getProgramCourses');
const { add: addCourse } = require('./course/add');
// const { addComunicaRoomsBetweenStudentsAndTeachers } = require('./addComunicaRoomsBetweenStudentsAndTeachers');

async function updateClass({ data, ctx }) {
  await validateUpdateClass({ data, ctx });

  let goodGroup = null;

  const cClass = await ctx.tx.db.Class.findOne({ id: data.id }).select(['program']).lean();

  const program = await ctx.tx.db.Programs.findOne({ id: cClass.program })
    .select(['id', 'name', 'useOneStudentGroup'])
    .lean();

  if (program.useOneStudentGroup) {
    const group = await ctx.tx.db.Groups.findOne({
      isAlone: true,
      type: 'group',
      program: program.id,
    })
      .select('column')
      .lean();
    goodGroup = group.id;
  }

  // eslint-disable-next-line prefer-const
  let { id, course, group, knowledge, substage, teachers, schedule, icon, image, ...rest } = data;

  if (!goodGroup && group) {
    goodGroup = group;
  }

  // ES: Actualizamos la clase
  let nClass = await ctx.tx.db.Class.findOneAndUpdate({ id }, rest, { new: true, lean: true });

  // ES: Añadimos el asset de la imagen
  const imageData = {
    indexable: true,
    public: true, // TODO Cambiar a false despues de hacer la demo
    name: nClass.id,
  };
  if (image) imageData.cover = image;
  const assetImage = await ctx.tx.call('leebrary.assets.update', {
    data: { id: nClass.image, ...imageData },
    published: true,
  });

  nClass = await ctx.tx.db.Class.findOneAndUpdate(
    { id: nClass.id },
    {
      image: assetImage.id,
    },
    { new: true, lean: true }
  );

  const promises = [];
  // ES: Añadimos todas las relaciones de la clase

  if (_.isNull(knowledge) || knowledge) await removeKnowledgeByClass({ classIds: nClass.id, ctx });
  if (knowledge) {
    // ES: Comprobamos que todos los conocimientos existen y pertenecen al programa
    if (!(await existKnowledgeInProgram({ id: knowledge, program: nClass.program, ctx }))) {
      throw new LeemonsError(ctx, { message: 'knowledge not in program' });
    }
    promises.push(addKnowledge({ class: nClass.id, knowledge, ctx }));
  }

  if (_.isNull(substage) || substage) await removeSubstageByClass({ classIds: nClass.id, ctx });
  if (substage) {
    // ES: Comprobamos que todos los substages existen y pertenecen al programa
    if (!(await existSubstageInProgram({ id: substage, program: nClass.program, ctx }))) {
      throw new LeemonsError(ctx, { message: 'One of substage not in program' });
    }

    const substages = _.isArray(substage) ? substage : [substage];
    _.forEach(substages, (sub) => {
      promises.push(addSubstage({ class: nClass.id, substage: sub, ctx }));
    });
  }

  if (!course) {
    const programCourses = await getProgramCourses({ ids: nClass.program, ctx });
    course = programCourses[0].id;
  }

  if (_.isNull(course) || course) {
    await Promise.all([
      removeCourseByClass({ classIds: nClass.id, ctx }),
      setToAllClassesWithSubject({ subject: nClass.subject, course: [], ctx }),
    ]);
  }
  if (course) {
    // ES: Comprobamos que todos los cursos existen y pertenecen al programa
    if (!(await existCourseInProgram({ id: course, program: nClass.program, ctx }))) {
      throw new LeemonsError(ctx, { message: 'course not in program' });
    }
    const courses = isArray(course) ? course : [course];
    promises.push(
      Promise.all([
        Promise.all(map(courses, (c) => addCourse({ class: nClass.id, course: c, ctx }))),
        setToAllClassesWithSubject({ subject: nClass.subject, course: courses, ctx }),
      ])
    );
  }

  if (_.isNull(goodGroup) || goodGroup) await removeGroupByClass({ classIds: nClass.id, ctx });
  if (goodGroup) {
    // ES: Comprobamos que todos los cursos existen y pertenecen al programa
    if (!(await existGroupInProgram({ id: goodGroup, program: nClass.program, ctx }))) {
      throw new LeemonsError(ctx, { message: 'group not in program' });
    }
    if (
      await isUsedInSubject({ subject: nClass.subject, group: goodGroup, classe: nClass.id, ctx })
    ) {
      throw new LeemonsError(ctx, { message: 'group is already used in subject' });
    }
    promises.push(addGroup({ class: nClass.id, group: goodGroup, ctx }));
  }

  if (_.isNull(goodGroup) || teachers) {
    await removeTeachersByClass({ classIds: nClass.id, ctx });
  }

  if (teachers)
    await Promise.all(
      _.map(teachers, ({ teacher, type }) => addTeacher({ class: nClass.id, teacher, type, ctx }))
    );

  // ES: Cambiamos el resto de clases que tengan esta asignatura y le seteamos el mismo tipo de asignatura
  promises.push(
    ctx.tx.db.Class.updateMany(
      { subject: nClass.subject },
      { subjectType: nClass.subjectType, color: nClass.color }
    )
  );

  // ES: Cambiamos el resto de clases que tengan esta asignatura y le seteamos el mismo knowledge
  promises.push(changeBySubject({ subjectId: nClass.subject, knowledge, ctx }));

  promises.push(await processScheduleForClass({ schedule, classId: nClass.id, ctx }));

  await Promise.all(promises);

  let classe = (await classByIds({ ids: nClass.id, ctx }))[0];
  [classe] = await getClassesProgramInfo({
    programs: program.id,
    classes: [classe],
    ctx,
  });

  await ctx.tx.emit('after-update-class', { class: classe });

  // await addComunicaRoomsBetweenStudentsAndTeachers({ classe, ctx });

  try {
    let subName = program.name;
    if (classe.groups?.abbreviation) {
      subName += ` - ${classe.groups?.abbreviation}`;
    }
    const roomData = {
      name: `${classe.subject.name} ${subName}`,
      type: ctx.prefixPN('class.group'),
      // subName,
      bgColor: classe.subject.color,
      image: null,
      icon: '/public/academic-portfolio/subject-icon.svg',
      program: data.program,
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
    if (assetImage.cover) {
      roomData.image = assetImage.id;
    }

    let action = 'add';
    if (
      await ctx.tx.call('comunica.room.exists', {
        key: ctx.prefixPN(`room.class.group.${nClass.id}`),
      })
    ) {
      action = 'update';
    }
    await ctx.tx.call(`comunica.room.${action}`, {
      key: ctx.prefixPN(`room.class.group.${nClass.id}`),
      ...roomData,
    });

    action = 'add';
    if (
      await ctx.tx.call('comunica.room.exists', {
        key: ctx.prefixPN(`room.class.${nClass.id}`),
      })
    ) {
      action = 'update';
    }
    await ctx.tx.call(`comunica.room.${action}`, {
      ...roomData,
      type: ctx.prefixPN('class'),
      key: ctx.prefixPN(`room.class.${nClass.id}`),
      parentRoom: ctx.prefixPN(`room.class.group.${nClass.id}`),
      name: 'roomCard.class',
      subName: roomData.name,
      icon: '/public/academic-portfolio/class-icon.svg',
    });
  } catch (e) {
    // Nothing
  }

  return classe;
}

module.exports = { updateClass };

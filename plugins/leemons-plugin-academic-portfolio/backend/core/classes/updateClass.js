const { LeemonsError } = require('@leemons/error');
const _ = require('lodash');
const { isArray, map } = require('lodash');

const { validateUpdateClass } = require('../../validations/forms');
const { existCourseInProgram } = require('../courses/existCourseInProgram');
const { existGroupInProgram } = require('../groups/existGroupInProgram');
const { existSubstageInProgram } = require('../substages/existSubstageInProgram');

const {
  addComunicaRoomsBetweenStudentsAndTeachers,
} = require('./addComunicaRoomsBetweenStudentsAndTeachers');
const { classByIds } = require('./classByIds');
const { add: addCourse } = require('./course/add');
const { removeByClass: removeCourseByClass } = require('./course/removeByClass');
const { setToAllClassesWithSubject } = require('./course/setToAllClassesWithSubject');
const { add: addGroup } = require('./group/add');
const { isUsedInSubject } = require('./group/isUsedInSubject');
const { removeByClass: removeGroupByClass } = require('./group/removeByClass');
const { getClassesProgramInfo } = require('./listSessionClasses');
const { processScheduleForClass } = require('./processScheduleForClass');
const { add: addSubstage } = require('./substage/add');
const { removeByClass: removeSubstageByClass } = require('./substage/removeByClass');
const { add: addTeacher } = require('./teacher/add');
const { removeByClass: removeTeachersByClass } = require('./teacher/removeByClass');

async function updateClass({ data, ctx }) {
  await validateUpdateClass({ data, ctx });

  const cClass = await ctx.tx.db.Class.findOne({ id: data.id }).select(['program']).lean();

  const program = await ctx.tx.db.Programs.findOne({ id: cClass.program })
    .select(['id', 'name', 'useOneStudentGroup'])
    .lean();

  const { id, course, group, knowledge, substage, teachers, schedule, icon, image, ...rest } = data;

  // ES: Actualizamos la clase
  let nClass = await ctx.tx.db.Class.findOneAndUpdate({ id }, rest, { new: true, lean: true });

  // ES: Añadimos el asset de la imagen
  const imageData = {
    indexable: false,
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

  //* OLD Knowledge area se cambia a nivel de subject, dentro de updateSubject Se actualizan todas las clases
  // if (_.isNull(knowledge) || knowledge) await removeKnowledgeByClass({ classIds: nClass.id, ctx });
  // if (knowledge) {
  //   // ES: Comprobamos que todos los conocimientos existen y pertenecen al programa
  //   if (!(await existKnowledgeInProgram({ id: knowledge, program: nClass.program, ctx }))) {
  //     throw new LeemonsError(ctx, { message: 'knowledge not in program' });
  //   }
  //   promises.push(addKnowledge({ class: nClass.id, knowledge, ctx }));
  // }
  //* OLD Esto sería válido si el knowledgeArea se actualizara para una sóla clase en edición aislada de la misma. No es el caso. KnowledgeArea se cambia a nivel de asignatura
  // ES: Cambiamos el resto de clases que tengan esta asignatura y le seteamos el mismo knowledge
  // promises.push(changeBySubject({ subjectId: nClass.subject, knowledge, ctx }));

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

  if (_.isNull(group) || group) await removeGroupByClass({ classIds: nClass.id, ctx });
  if (group) {
    // ES: Comprobamos que todos los cursos existen y pertenecen al programa
    if (!(await existGroupInProgram({ id: group, program: nClass.program, ctx }))) {
      throw new LeemonsError(ctx, { message: 'group not in program' });
    }
    if (await isUsedInSubject({ subject: nClass.subject, group, classe: nClass.id, ctx })) {
      throw new LeemonsError(ctx, { message: 'group is already used in subject' });
    }
    promises.push(addGroup({ class: nClass.id, group, ctx }));
  }

  if (_.isNull(group) || teachers) {
    await removeTeachersByClass({ classIds: nClass.id, ctx });
  }

  if (teachers)
    await Promise.all(
      _.map(teachers, ({ teacher, type }) => addTeacher({ class: nClass.id, teacher, type, ctx }))
    );

  //* OLD Esto es válido si el subjectType se puede cambian para una clase en la edición aislada de clase. No es el caso. SubjectType se cambia a nivel de asignatura
  // ES: Cambiamos el resto de clases que tengan esta asignatura y le seteamos el mismo tipo de asignatura
  // promises.push(
  //   ctx.tx.db.Class.updateMany(
  //     { subject: nClass.subject },
  //     { subjectType: nClass.subjectType, color: nClass.color }
  //   )
  // );

  promises.push(await processScheduleForClass({ schedule, classId: nClass.id, ctx }));

  await Promise.all(promises);

  let classe = (await classByIds({ ids: nClass.id, ctx }))[0];
  [classe] = await getClassesProgramInfo({
    programs: program.id,
    classes: [classe],
    ctx,
  });

  await ctx.tx.emit('after-update-class', classe);

  try {
    await addComunicaRoomsBetweenStudentsAndTeachers({ classe, ctx });

    let subName = program.name;
    if (classe.groups?.abbreviation) {
      subName += ` - ${classe.groups?.abbreviation}`;
    }
    const roomData = {
      name: `${classe.subject.name}`,
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
      // icon: '/public/academic-portfolio/class-icon.svg',
    });
  } catch (e) {
    // Nothing
  }

  return classe;
}

module.exports = { updateClass };

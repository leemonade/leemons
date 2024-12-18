const { LeemonsError } = require('@leemons/error');
const _ = require('lodash');
const { isArray, map, pick } = require('lodash');

const { SOCKET_EVENTS } = require('../../config/constants');
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

function emitUpdateClassEvent({
  class: classData,
  ctx,
  message,
  status = 'updating',
  error = null,
  eventName = SOCKET_EVENTS.CLASS_UPDATE,
}) {
  const [userAgent] = ctx.meta.userSession?.userAgents ?? [];

  if (userAgent?.id) {
    ctx.socket.emit(userAgent.id, eventName, {
      class: pick(classData, ['id', 'alias', 'classroomId', 'subject', 'program']),
      status,
      message,
      error,
    });
  }
}

async function prepareUpdateClass({ data, ctx }) {
  const cClass = await ctx.tx.db.Class.findOne({ id: data.id })
    .select(['program', 'status'])
    .lean();

  const program = await ctx.tx.db.Programs.findOne({ id: cClass.program })
    .select(['id', 'name', 'useOneStudentGroup'])
    .lean();

  const { id, course, group, knowledge, substage, teachers, schedule, icon, image, ...rest } = data;

  // Update class status to updating
  const nClass = await ctx.tx.db.Class.findOneAndUpdate(
    { id },
    { ...rest, status: 'updating' },
    { new: true, lean: true }
  );

  return { nClass, program };
}

async function executeUpdateClass({ data, class: nClass, program, ctx }) {
  const { course, group, substage, teachers, schedule, image } = data;

  try {
    // ··············································
    // HANDLING IMAGE

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

    // ··············································
    // HANDLING SUBSTAGES

    if (_.isNull(substage) || substage) await removeSubstageByClass({ classIds: nClass.id, ctx });
    if (substage) {
      emitUpdateClassEvent({ class: nClass, ctx, message: 'CLASS_UPDATE_SUBSTAGES' });

      // Check if all substages exist and belong to the program
      if (!(await existSubstageInProgram({ id: substage, program: nClass.program, ctx }))) {
        throw new LeemonsError(ctx, { message: 'One of substage not in program' });
      }

      const substages = _.isArray(substage) ? substage : [substage];
      _.forEach(substages, (sub) => {
        promises.push(addSubstage({ class: nClass.id, substage: sub, ctx }));
      });
    }

    // ··············································
    // HANDLING COURSES

    if (_.isNull(course) || course) {
      await Promise.all([
        removeCourseByClass({ classIds: nClass.id, ctx }),
        setToAllClassesWithSubject({ subject: nClass.subject, course: [], ctx }),
      ]);
    }

    if (course) {
      emitUpdateClassEvent({ class: nClass, ctx, message: 'CLASS_UPDATE_COURSES' });

      // Check if all courses exist and belong to the program
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

    // ··············································
    // HANDLING GROUPS

    if (_.isNull(group) || group) await removeGroupByClass({ classIds: nClass.id, ctx });
    if (group) {
      emitUpdateClassEvent({ class: nClass, ctx, message: 'CLASS_UPDATE_GROUPS' });

      // Check if all groups exist and belong to the program
      if (!(await existGroupInProgram({ id: group, program: nClass.program, ctx }))) {
        throw new LeemonsError(ctx, { message: 'group not in program' });
      }
      if (await isUsedInSubject({ subject: nClass.subject, group, classe: nClass.id, ctx })) {
        throw new LeemonsError(ctx, { message: 'group is already used in subject' });
      }
      promises.push(addGroup({ class: nClass.id, group, ctx }));
    }

    // ··············································
    // HANDLING TEACHERS

    if (teachers) {
      emitUpdateClassEvent({ class: nClass, ctx, message: 'CLASS_UPDATE_TEACHERS' });
    }

    if (_.isNull(group) || teachers) {
      await removeTeachersByClass({ classIds: nClass.id, ctx });
    }

    if (teachers) {
      await Promise.all(
        _.map(teachers, ({ teacher, type }) => addTeacher({ class: nClass.id, teacher, type, ctx }))
      );
    }

    // ··············································
    // HANDLING SCHEDULE

    emitUpdateClassEvent({ class: nClass, ctx, message: 'CLASS_UPDATE_SCHEDULE' });

    promises.push(await processScheduleForClass({ schedule, classId: nClass.id, ctx }));

    // ··············································
    // UPDATE CLASS STATUS TO READY AND EMIT EVENT

    await Promise.all(promises);

    // Update class status to ready
    await ctx.tx.db.Class.updateOne({ id: nClass.id }, { $set: { status: 'ready' } });

    let classe = (await classByIds({ ids: nClass.id, ctx }))[0];
    [classe] = await getClassesProgramInfo({
      programs: program.id,
      classes: [classe],
      ctx,
    });

    emitUpdateClassEvent({
      ctx,
      class: nClass,
      message: 'CLASS_UPDATE_SUCCESS',
      status: 'completed',
    });

    await ctx.tx.emit('after-update-class', classe);

    // ················��·····························
    // HANDLING COMUNICA ROOMS

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

    // ··············································
    // FINALLY

    return classe;
  } catch (error) {
    await ctx.tx.db.Class.updateOne({ id: nClass.id }, { $set: { status: 'ready' } });
    throw error;
  }
}

async function updateClass({ data, ctx }) {
  await validateUpdateClass({ data, ctx });

  const cClass = await ctx.tx.db.Class.findOne({ id: data.id })
    .select(['program', 'status'])
    .lean();

  if (cClass?.status === 'updating') {
    throw new LeemonsError(ctx, {
      httpStatusCode: 400,
      customCode: 'CLASS_STATUS_ALREADY_UPDATING',
      message: 'Class is already updating. Try again later.',
    });
  }

  const { nClass, program } = await prepareUpdateClass({ data, ctx });

  return executeUpdateClass({ data, class: nClass, program, ctx });
}

module.exports = { updateClass, executeUpdateClass, prepareUpdateClass, emitUpdateClassEvent };

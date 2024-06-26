const { LeemonsError } = require('@leemons/error');
const _ = require('lodash');
const { isArray, map } = require('lodash');
const { validateAddClass } = require('../../validations/forms');
const { add: addKnowledge } = require('./knowledge/add');
const { add: addSubstage } = require('./substage/add');
const { add: addCourse } = require('./course/add');
const { add: addGroup } = require('./group/add');
const { add: addTeacher } = require('./teacher/add');
const { existSubstageInProgram } = require('../substages/existSubstageInProgram');
const { existCourseInProgram } = require('../courses/existCourseInProgram');
const { existGroupInProgram } = require('../groups/existGroupInProgram');
const { classByIds } = require('./classByIds');
const { processScheduleForClass } = require('./processScheduleForClass');
const { setToAllClassesWithSubject } = require('./course/setToAllClassesWithSubject');
const { isUsedInSubject } = require('./group/isUsedInSubject');
const { getProgramCourses } = require('../programs/getProgramCourses');
const { getClassesProgramInfo } = require('./listSessionClasses');
const { knowledgeAreaExistsInCenter } = require('../knowledges');
const {
  addComunicaRoomsBetweenStudentsAndTeachers,
} = require('./addComunicaRoomsBetweenStudentsAndTeachers');
const { getSubjectGroupCourseNamesFromClassData } = require('../common');

async function addClass({ data, ctx }) {
  try {
    await validateAddClass({ data, ctx });

    let goodGroup = null;

    const program = await ctx.tx.db.Programs.findOne({ id: data.program })
      .select(['id', 'name', 'useOneStudentGroup'])
      .lean();
    let programCenterId = await ctx.tx.db.ProgramCenter.findOne({ program: program.id }).lean();
    programCenterId = programCenterId?.center;

    // if (program.useOneStudentGroup) {
    //   const group = await ctx.tx.db.Groups.findOne({
    //     isAlone: true,
    //     type: 'group',
    //     program: program.id,
    //   })
    //     .select(['id'])
    //     .lean();
    //   goodGroup = group.id;
    // }

    // eslint-disable-next-line prefer-const
    const {
      course: _course,
      group,
      knowledgeArea,
      substage,
      teachers,
      schedule,
      image,
      icon,
      ...rest
    } = data;
    let course = _course;

    if (!goodGroup && group) {
      goodGroup = group;
    }

    // ES: Creamos la clase
    let nClass = await ctx.tx.db.Class.create(rest);
    nClass = nClass.toObject();

    // ES: Añadimos el asset de la imagen
    const imageData = {
      indexable: false,
      public: true, // TODO Cambiar a false despues de hacer la demo
      name: nClass.id,
    };
    if (image) imageData.cover = image;

    const assetImage = await ctx.tx.call('leebrary.assets.add', {
      asset: imageData,
      options: {
        permissions: [
          {
            canEdit: true,
            isCustomPermission: true,
            permissionName: ctx.prefixPN('programs'),
            actionNames: ['update', 'admin'],
          },
        ],
        published: true,
      },
    });

    nClass = await ctx.tx.db.Class.findOneAndUpdate(
      { id: nClass.id },
      {
        image: assetImage.id,
      },
      {
        lean: true,
        new: true,
      }
    );

    // ES: Añadimos todas las relaciones de la clase
    const promises = [];

    if (knowledgeArea) {
      // ES: Comprobamos que todos los conocimientos existen y pertenecen al centro
      if (
        !(await knowledgeAreaExistsInCenter({ id: knowledgeArea, center: programCenterId, ctx }))
      ) {
        throw new LeemonsError(ctx, { message: 'The knowledge area does not exist in Center.' });
      }
      promises.push(addKnowledge({ class: nClass.id, knowledge: knowledgeArea, ctx }));
    }
    if (substage) {
      // ES: Comprobamos que todos los substages existen y pertenecen al programa
      if (!(await existSubstageInProgram({ id: substage, program: nClass.program, ctx }))) {
        throw new LeemonsError(ctx, { message: 'The substage does not exist in Program.' });
      }
      const substages = _.isArray(substage) ? substage : [substage];
      _.forEach(substages, (id) => {
        promises.push(addSubstage({ class: nClass.id, substage: id, ctx }));
      });
    }
    if (!course) {
      const programCourses = await getProgramCourses({ ids: nClass.program, ctx });
      course = programCourses[0].id;
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
          // Old to update all classes: setToAllClassesWithSubject({ subject: nClass.subject, course: courses, ctx }),
        ])
      );
    }

    if (goodGroup) {
      // ES: Comprobamos que todos los grupos existen y pertenecen al programa
      if (!(await existGroupInProgram({ id: goodGroup, program: nClass.program, ctx }))) {
        throw new LeemonsError(ctx, { message: 'group not in program' });
      }
      if (
        await isUsedInSubject({
          subject: nClass.subject,
          group: goodGroup,
          classe: nClass.id,
          ctx,
        })
      ) {
        throw new LeemonsError(ctx, { message: 'group is already used in subject' });
      }
      promises.push(addGroup({ class: nClass.id, group: goodGroup, ctx }));
    }

    //* De ser necesario hacer este tipo de actualizaciones descomentar esto
    /*
    // ES: Cambiamos el resto de clases que tengan esta asignatura y le seteamos el mismo tipo de asignatura
    promises.push(
      ctx.tx.db.Class.updateMany(
        { subject: nClass.subject },
        { subjectType: nClass.subjectType, color: nClass.color }
      )
    );

    // ES: Cambiamos el resto de clases que tengan esta asignatura y le seteamos el mismo knowledge
    promises.push(changeBySubject({ subjectId: nClass.subject, knowledge: knowledgeArea, ctx }));
    */

    promises.push(
      ctx.tx.call('users.permissions.addItem', {
        item: nClass.id,
        type: 'academic-portfolio.class',
        data: {
          permissionName: `academic-portfolio.class.${nClass.id}`,
          actionNames: ['view'],
        },
        isCustomPermission: true,
      })
    );

    if (schedule) {
      promises.push(processScheduleForClass({ schedule, classId: nClass.id, ctx }));
    }

    await Promise.all(promises);

    let classe = (await classByIds({ ids: nClass.id, ctx }))[0];

    const displayNameParsed = getSubjectGroupCourseNamesFromClassData(classe);

    // Comunica set up

    const roomData = {
      name: displayNameParsed.subject,
      type: ctx.prefixPN('class.group'),
      subName: displayNameParsed.courseAndGroupParsed,
      bgColor: classe.subject.color,
      image: null,
      icon: '/public/academic-portfolio/subject-icon.svg', // Default
      program: data.program,
      center: programCenterId,
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

    await ctx.tx.call('comunica.room.add', {
      key: ctx.prefixPN(`room.class.group.${nClass.id}`),
      ...roomData,
    });

    await ctx.tx.call('comunica.room.add', {
      ...roomData,
      type: ctx.prefixPN('class'),
      key: ctx.prefixPN(`room.class.${nClass.id}`),
      parentRoom: ctx.prefixPN(`room.class.group.${nClass.id}`),
      name: 'roomCard.class',
      subName: roomData.name,
      icon: '/public/academic-portfolio/class-icon.svg',
    });

    [classe] = await getClassesProgramInfo({
      programs: data.program,
      classes: [classe],
      ctx,
    });
    await ctx.tx.emit('after-add-class', {
      class: classe,
      displayName: `${displayNameParsed.subject} - ${displayNameParsed.courseAndGroupParsed}`,
    });

    if (teachers) {
      await Promise.all(
        _.map(teachers, ({ teacher, type }) => addTeacher({ class: nClass.id, teacher, type, ctx }))
      );
    }

    //* Previously commented room
    // await addComunicaRoomsBetweenStudentsAndTeachers({ classe, ctx });
    await addComunicaRoomsBetweenStudentsAndTeachers({ classe, ctx });

    return (await classByIds({ ids: nClass.id, ctx }))[0];
  } catch (e) {
    if (e instanceof LeemonsError) throw e;
    else
      throw new LeemonsError(ctx, {
        message: e.message ?? 'Something went wrong',
        httpStatusCode: 400,
      });
  }
}

module.exports = { addClass };

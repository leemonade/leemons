/* eslint-disable no-param-reassign */
const _ = require('lodash');

const teacherTypes = ['main-teacher', 'associate-teacher'];

async function afterRemoveClassesTeachers({ classTeachers, ctx }) {
  if (classTeachers?.length) {
    const classIds = _.map(classTeachers, 'class');
    // Sacamos todas las instancias existentes para las clases afectadas
    const assignClasses = await ctx.tx.db.Classes.find({ class: classIds }).lean();
    const instanceIds = _.uniq(_.map(assignClasses, 'assignableInstance'));
    // De todas las instancias, sacamos todas las asignaciones
    const [assignations, cl] = await Promise.all([
      ctx.tx.db.Assignations.find({ instance: instanceIds })
        .select(['id', 'classes', 'user'])
        .lean(),
      ctx.tx.db.Classes.find({ assignableInstance: instanceIds }).lean(),
    ]);
    const classesByInstance = {};
    _.forEach(cl, (c) => {
      if (!classesByInstance[c.assignableInstance]) {
        classesByInstance[c.assignableInstance] = [];
      }
      classesByInstance[c.assignableInstance].push(c.class);
    });
    let classesIds = [];
    _.forEach(assignations, (assignation) => {
      assignation.classes = classesByInstance[assignation.instance];
      classesIds = classesIds.concat(assignation.classes);
    });
    classesIds = _.uniq(classesIds);

    // Sacamos todas las clases que hay en las asignaciones
    const classes = await ctx.tx.call(
      'academic-portfolio.classes.classByIds',
      {
        ids: classesIds,
        withTeachers: true,
      },
      {
        meta: { userSession: { userAgents: [{ id: classTeachers[0].teacher }] } },
      }
    );

    const classesById = _.keyBy(classes, 'id');
    const promises = [];

    // Nos recorremos todas las asignaciones
    _.forEach(assignations, (assignation) => {
      const assignationClasses = _.map(assignation.classes, (classId) => classesById[classId]);
      const SUBJECT_ID = 'subject.id';
      const classesBySubject = _.groupBy(assignationClasses, SUBJECT_ID);
      const subjectIds = _.map(_.uniqBy(assignationClasses, SUBJECT_ID), SUBJECT_ID);
      // Para cada asignación, nos recorremos las asignaturas que tiene
      _.forEach(subjectIds, (subjectId) => {
        const _classes = classesBySubject[subjectId];
        const _classIds = _.map(_classes, 'id');
        // De los profesores borrados sacamos los que corresponden a las clases de la asignatura en la que estamos
        const teachersRemoved = _.map(
          _.filter(classTeachers, (classTeacher) => _.includes(_classIds, classTeacher.class)),
          'teacher'
        );
        // Tambien sacamos los profesores actuales de las clases
        const currentTeachers = [];
        _.forEach(_classes, (data) => {
          _.forEach(data.teachers, (teacher) => {
            if (teacherTypes.includes(teacher.type)) currentTeachers.push(teacher.id);
          });
        });

        // De los profesores borrados sacamos los que ya no esta en ninguna clase
        const teachersToRemove = [];
        _.forEach(teachersRemoved, (teacherId) => {
          if (!_.includes(currentTeachers, teacherId)) teachersToRemove.push(teacherId);
        });

        // Los profesores que no estan en ninguna clase de dicha asignatura son borrados de la sala de chat
        if (teachersToRemove.length) {
          promises.push(
            ctx.tx.call('comunica.room.removeUserAgents', {
              key: ctx.prefixPN(
                `subject|${subjectId}.assignation|${assignation.id}.userAgent|${assignation.user}`
              ),
              userAgents: teachersToRemove,
            })
          );
        }
      });
    });

    await Promise.allSettled(promises);
  }
}

module.exports = { afterRemoveClassesTeachers };

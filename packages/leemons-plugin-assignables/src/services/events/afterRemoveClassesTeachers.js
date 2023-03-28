/* eslint-disable no-param-reassign */
const _ = require('lodash');

async function afterRemoveClassesTeachers({ classTeachers, transacting }) {
  if (classTeachers?.length) {
    const table = require('../tables');
    const classIds = _.map(classTeachers, 'class');
    // Sacamos todas las instancias existentes para las clases afectadas
    const assignClasses = await table.classes.find({ class_$in: classIds }, { transacting });
    const instanceIds = _.uniq(_.map(assignClasses, 'assignableInstance'));
    // De todas las instancias, sacamos todas las asignaciones
    const [assignations, cl] = await Promise.all([
      table.assignations.find(
        { instance_$in: instanceIds },
        { column: ['id', 'classes', 'user'], transacting }
      ),
      table.classes.find({ assignableInstance_$in: instanceIds }, { transacting }),
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
    const comunicaServices = leemons.getPlugin('comunica').services;
    const academicPortfolioServices = leemons.getPlugin('academic-portfolio').services;
    // Sacamos todas las clases que hay en las asignaciones
    const classes = await academicPortfolioServices.classes.classByIds(classesIds, {
      withTeachers: true,
      userSession: { userAgents: [{ id: classTeachers[0].teacher }] },
      transacting,
    });
    const classesById = _.keyBy(classes, 'id');
    const promises = [];

    // Nos recorremos todas las asignaciones
    _.forEach(assignations, (assignation) => {
      const assignationClasses = _.map(assignation.classes, (classId) => classesById[classId]);
      const classesBySubject = _.groupBy(assignationClasses, 'subject.id');
      const subjectIds = _.map(_.uniqBy(assignationClasses, 'subject.id'), 'subject.id');
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
            if (teacher.type === 'main-teacher') currentTeachers.push(teacher.id);
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
            comunicaServices.room.removeUserAgents(
              leemons.plugin.prefixPN(
                `subject|${subjectId}.assignation|${assignation.id}.userAgent|${assignation.user}`
              ),
              teachersToRemove,
              { transacting }
            )
          );
        }
      });
    });

    await Promise.allSettled(promises);
  }
}

module.exports = { afterRemoveClassesTeachers };

/* eslint-disable no-param-reassign */
const _ = require('lodash');

async function afterAddClassTeacher({ class: classe, teacher, type, transacting }) {
  if (type === 'main-teacher') {
    const table = require('../tables');
    // Sacamos todas las instancias existentes para las clases afectadas
    const assignClasses = await table.classes.find({ class: classe }, { transacting });
    const instanceIds = _.uniq(_.map(assignClasses, 'assignableInstance'));
    // De todas las instancias, sacamos todas las asignaciones
    const assignations = await table.assignations.find(
      { instance_$in: instanceIds },
      { column: ['id', 'classes', 'user'], transacting }
    );

    const comunicaServices = leemons.getPlugin('comunica').services;
    const academicPortfolioServices = leemons.getPlugin('academic-portfolio').services;
    // Sacamos todas las clases que hay en las asignaciones
    const [_classe] = await academicPortfolioServices.classes.classByIds([classe], {
      withTeachers: true,
      userSession: { userAgents: [{ id: teacher }] },
      transacting,
    });

    const promises = [];

    // Nos recorremos todas las asignaciones
    _.forEach(assignations, (assignation) => {
      // Para cada asignación, nos recorremos las asignaturas que tiene

      promises.push(
        comunicaServices.room.addUserAgents(
          leemons.plugin.prefixPN(
            `subject|${_classe.subject.id}.assignation|${assignation.id}.userAgent|${assignation.user}`
          ),
          teacher,
          { transacting }
        )
      );
    });

    await Promise.allSettled(promises);
  }
}

module.exports = { afterAddClassTeacher };

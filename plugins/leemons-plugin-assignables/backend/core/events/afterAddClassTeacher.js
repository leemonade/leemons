/* eslint-disable no-param-reassign */
const _ = require('lodash');

const { addTeachersToAssignableInstance } = require('../teachers/addTeachersToAssignableInstance');

const canAssignTeacherRoles = ['main-teacher', 'associate-teacher'];

async function afterAddClassTeacher({ class: classe, teacher, type, ctx }) {
  if (canAssignTeacherRoles.includes(type)) {
    // Sacamos todas las instancias existentes para las clases afectadas
    const assignClasses = await ctx.tx.db.Classes.find({ class: classe }).lean();
    const instanceIds = _.uniq(_.map(assignClasses, 'assignableInstance'));
    // De todas las instancias, sacamos todas las asignaciones
    const instances = await ctx.tx.db.Instances.find({ id: instanceIds }).lean();
    const assignations = await ctx.tx.db.Assignations.find({ instance: instanceIds })
      .select(['id', 'classes', 'user'])
      .lean();

    // Sacamos todas las clases que hay en las asignaciones
    const [_classe] = await ctx.tx.call(
      'academic-portfolio.classes.classByIds',
      {
        ids: [classe],
        withTeachers: true,
      },
      {
        userAgents: [{ id: teacher }],
      }
    );

    const promises = [];

    await Promise.all(
      instances.map(async (instance) => {
        await addTeachersToAssignableInstance({
          teachers: [{ teacher, type }],
          id: instance.id,
          assignable: instance.assignable,
          ctx,
        });

        if (instance.event) {
          await ctx.tx.call('calendar.calendar.grantAccessUserAgentToEvent', {
            id: instance.event,
            userAgentId: [teacher],
            actionName: 'view',
          });
        }
      })
    );

    // Nos recorremos todas las asignaciones
    _.forEach(assignations, (assignation) => {
      // Para cada asignación, nos recorremos las asignaturas que tiene

      promises.push(
        ctx.tx.call('comunica.room.addUserAgents', {
          // room, userAgent, isAdmin, ctx
          key: ctx.prefixPN(
            `subject|${_classe.subject.id}.assignation|${assignation.id}.userAgent|${assignation.user}`
          ),
          userAgent: teacher,
        })
      );
    });

    await Promise.allSettled(promises);
  }
}

module.exports = { afterAddClassTeacher };

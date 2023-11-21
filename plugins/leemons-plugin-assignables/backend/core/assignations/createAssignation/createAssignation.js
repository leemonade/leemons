const _ = require('lodash');
const { LeemonsError } = require('@leemons/error');
const { validateAssignation } = require('../../helpers/validators/assignation');
const { getInstance } = require('../../instances/getInstance');
const { getAllTeachers } = require('./getAllTeachers');
const { createInstanceRoom } = require('./createInstanceRoom');
const { createGroupRoom } = require('./createGroupRoom');
const { createSubjectsRooms } = require('./createSubjectsRooms');
const { checkIfStudentIsOnInstance } = require('./checkIfStudentIsOnInstance');
const { addUserSubjectRoom } = require('./addUserSubjectRoom');
const { sendEmail } = require('../../instances/sendEmail');
const { registerDates } = require('../../dates');
const { registerGrade } = require('../../grades');

const rolesWithChat = ['tests', 'task'];

async function createAssignation({ assignableInstanceId, users, options, ctx }) {
  const { userSession } = ctx.meta;
  // TODO: Permissions like `task.${taskId}.instance.${instanceId}` to allow assignation removals and permissions changes
  validateAssignation(
    {
      instance: assignableInstanceId,
      users,
      ...options,
    },
    { useRequired: true }
  );

  // EN: Get the assignable instance, if not permissions, it will throw an error
  // ES: Obtiene la instancia asignable, si no tiene permisos, lanzará un error
  const [instance, userAgents] = await Promise.all([
    getInstance({
      id: assignableInstanceId,
      details: true,
      ctx,
    }),
    ctx.tx.call('users.users.getUserAgentsInfo', {
      userAgentIds: users,
      userColumns: ['id', 'email', 'avatar', 'locale'],
      withCenter: true,
    }),
  ]);

  const classesData = await ctx.tx.call('academic-portfolio.classes.classByIds', {
    ids: instance.classes,
    withTeachers: true,
  });

  const hostname = await ctx.tx.call('users.platform.getHostname');
  const hostnameApi = await ctx.tx.call('users.platform.getHostnameApi');

  const _classes = _.uniqBy(classesData, 'subject.id');
  const userAgentByIds = _.keyBy(userAgents, 'id');

  try {
    const { indexable, classes, group, grades, timestamps, status, metadata } = options;

    // Saber si la fecha que se quiere es la de visualizacion o la de inicio de la tarea.
    // instance.dates.visualization
    // instance.dates.start

    // TODO @MIGUEL
    let subjectRooms = null;
    let instanceRoom = null;
    if (rolesWithChat.includes(instance.assignable.role)) {
      const teachers = getAllTeachers({ classes: _classes, classesData });
      instanceRoom = await createInstanceRoom({
        assignableInstanceId,
        instance,
        classes: _classes,
        teachers,
        users,
        ctx,
      });

      // TODO @MIGUEL
      await createGroupRoom({
        assignableInstanceId,
        instance,
        classes: _classes,
        parentKey: instanceRoom.key,
        teachers,
        users,
        ctx,
      });

      // TODO @MIGUEL
      subjectRooms = await createSubjectsRooms({
        assignableInstanceId,
        instance,
        parentKey: instanceRoom.key,
        classes: _classes,
        teachers,
        ctx,
      });
    }

    // EN: Create the assignation
    // ES: Crea la asignación
    return await Promise.all(
      users.map(async (user) => {
        const isOnInstance = await checkIfStudentIsOnInstance({
          user,
          instance: assignableInstanceId,
          ctx,
        });

        if (isOnInstance) {
          throw new LeemonsError(ctx, {
            message: `The student ${user} is already assigned to instance ${assignableInstanceId}`,
          });
        }
        let assignation = await ctx.tx.db.Assignations.create({
          instance: assignableInstanceId,
          indexable: indexable || true,
          user,
          classes: JSON.stringify(classes || []),
          group,
          status,
          metadata: JSON.stringify(metadata),
        });
        assignation = assignation.toObject();

        const roomsPromises = [];

        _.forEach(_classes, (classe) => {
          const _teachers = [];
          _.forEach(classesData, (data) => {
            if (data.subject.id === classe.subject.id) {
              _.forEach(data.teachers, (teacher) => {
                if (teacher.type === 'main-teacher')
                  _teachers.push(
                    _.isString(teacher.teacher) ? teacher.teacher : teacher.teacher.id
                  );
              });
            }
          });

          // TODO @MIGUEL
          if (rolesWithChat.includes(instance.assignable.role)) {
            roomsPromises.push(
              addUserSubjectRoom({
                parentKey: `${subjectRooms[classe.subject.id].key}|${instanceRoom.key}`,
                classe,
                instance,
                assignation,
                user,
                teachers: _teachers,
                ctx,
              })
            );
          }
        });

        await Promise.all(roomsPromises);

        if (instance?.sendMail) {
          sendEmail({
            instance,
            userSession,
            userAgent: userAgentByIds[user],
            classes: _classes,
            hostname,
            hostnameApi,
            ctx,
          });
        }

        // EN: Save the timestamps
        // ES: Guarda los timestamps
        if (!_.isEmpty(timestamps)) {
          assignation.timestamps = await registerDates({
            type: 'assignation',
            instance: assignation.id,
            dates: timestamps,
            ctx,
          });
        }

        // EN: Save the grades
        // ES: Guarda las calificaciones
        if (!_.isEmpty(grades)) {
          assignation.grades = await Promise.all(
            grades.map((grade) => registerGrade({ assignation: assignation.id, ...grade, ctx }))
          );
        }

        return {
          instance: assignableInstanceId,
          indexable,
          classes,
          group,
          grades,
          timestamps,
          status,
          metadata,
        };
      })
    );
  } catch (e) {
    console.error(e);
    throw new Error(`Error creating assignation: ${e.message}`);
  }
}

module.exports = { createAssignation };

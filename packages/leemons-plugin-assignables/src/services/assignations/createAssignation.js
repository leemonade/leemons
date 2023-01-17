const _ = require('lodash');
const dayjs = require('dayjs');
dayjs.extend(require('dayjs/plugin/localeData'));
const getAssignableInstance = require('../assignableInstance/getAssignableInstance');
const { registerDates } = require('../dates');
const { assignations } = require('../tables');
const registerGrade = require('../grades/registerGrade');
const { validateAssignation } = require('../../helpers/validators/assignation');
const { sendEmail } = require('../assignableInstance/sendEmail');

async function checkIfStudentIsOnInstance(user, instance) {
  const assignationsCount = await assignations.count(
    {
      instance,
      user,
    },
    { column: ['id'] }
  );

  return assignationsCount > 0;
}

module.exports = async function createAssignation(
  assignableInstanceId,
  users,
  options,
  { userSession, transacting: t, ctx } = {}
) {
  // TODO: Permissions like `task.${taskId}.instance.${instanceId}` to allow assignation removals and permissions changes
  return global.utils.withTransaction(
    async (transacting) => {
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
        getAssignableInstance.call(this, assignableInstanceId, {
          userSession,
          details: true,
          transacting,
        }),
        leemons.getPlugin('users').services.users.getUserAgentsInfo(users, {
          withCenter: true,
          userColumns: ['id', 'email', 'locale'],
          transacting,
        }),
      ]);

      const comunicaServices = leemons.getPlugin('comunica').services;
      const academicPortfolioServices = leemons.getPlugin('academic-portfolio').services;
      const classesData = await academicPortfolioServices.classes.classByIds(instance.classes, {
        withTeachers: true,
        userSession,
        transacting,
      });

      const hostname = await leemons.getPlugin('users').services.platform.getHostname();

      const _classes = _.uniqBy(classesData, 'subject.id');
      const userAgentByIds = _.keyBy(userAgents, 'id');

      try {
        const { indexable, classes, group, grades, timestamps, status, metadata } = options;

        // EN: Create the assignation
        // ES: Crea la asignación
        return await Promise.all(
          users.map(async (user) => {
            const isOnInstance = await checkIfStudentIsOnInstance(user, assignableInstanceId, {
              userSession,
              transacting,
            });

            if (isOnInstance) {
              throw new Error(
                `The student ${user} is already assigned to instance ${assignableInstanceId}`
              );
            }
            const assignation = await assignations.create(
              {
                instance: assignableInstanceId,
                indexable: indexable || true,
                user,
                classes: JSON.stringify(classes || []),
                group,
                status,
                metadata: JSON.stringify(metadata),
              },
              { transacting }
            );

            const roomsPromises = [];

            _.forEach(_classes, ({ subject: { id: subjectId } }) => {
              const teachers = [];
              _.forEach(classesData, (data) => {
                if (data.subject.id === subjectId) {
                  _.forEach(data.teachers, (teacher) => {
                    if (teacher.type === 'main-teacher')
                      teachers.push(
                        _.isString(teacher.teacher) ? teacher.teacher : teacher.teacher.id
                      );
                  });
                }
              });

              roomsPromises.push(
                comunicaServices.room.add(
                  leemons.plugin.prefixPN(
                    `subject|${subjectId}.assignation|${assignation.id}.userAgent|${user}`
                  ),
                  {
                    userSession,
                    name: instance.assignable.asset.name,
                    userAgents: _.compact(_.uniq(teachers).concat(user)),
                  }
                )
              );
            });

            await Promise.all(roomsPromises);

            if (instance?.sendMail) {
              sendEmail({
                instance,
                userSession,
                userAgent: userAgentByIds[user],
                classes: _classes,
                ctx,
                hostname,
              });
            }

            // EN: Save the timestamps
            // ES: Guarda los timestamps
            if (!_.isEmpty(timestamps)) {
              assignation.timestamps = await registerDates(
                'assignation',
                assignation.id,
                timestamps,
                { transacting }
              );
            }

            // EN: Save the grades
            // ES: Guarda las calificaciones
            if (!_.isEmpty(grades)) {
              assignation.grades = await Promise.all(
                grades.map((grade) =>
                  registerGrade({ assignation: assignation.id, ...grade }, { transacting })
                )
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
        throw new Error(`Error creating assignation: ${e.message}`);
      }
    },
    assignations,
    t
  );
};

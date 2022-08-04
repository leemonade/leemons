const _ = require('lodash');
const dayjs = require('dayjs');
dayjs.extend(require('dayjs/plugin/localeData'));
const getAssignableInstance = require('../assignableInstance/getAssignableInstance');
const { registerDates } = require('../dates');
const { assignations } = require('../tables');
const registerGrade = require('../grades/registerGrade');
const { validateAssignation } = require('../../helpers/validators/assignation');

async function sendEmail(
  instance,
  userAgentByIds,
  user,
  classes,
  btnUrl,
  subjectIconUrl,
  userSession
) {
  try {
    const emailServices = leemons.getPlugin('emails').services;

    // eslint-disable-next-line prefer-const
    let [canSend, dayLimits] = await Promise.all([
      emailServices.config.getConfig(user, { keys: 'new-assignation-email' }),
      emailServices.config.getConfig(user, { keys: 'new-assignation-per-day-email' }),
    ]);

    if (dayLimits && instance.dates.deadline) {
      const hours = global.utils.diffHours(new Date(), new Date(instance.dates.deadline));
      canSend = hours < dayLimits * 24;
    }

    if (canSend) {
      let date = null;
      const options1 = { year: 'numeric', month: 'numeric', day: 'numeric' };
      if (instance.dates.deadline) {
        const date1 = new Date(instance.dates.deadline);
        const dateTimeFormat2 = new Intl.DateTimeFormat(userAgentByIds[user].user.locale, options1);
        date = dateTimeFormat2.format(date1);
      }

      emailServices.email
        .sendAsEducationalCenter(
          userAgentByIds[user].user.email,
          'user-create-assignation',
          userAgentByIds[user].user.locale,
          {
            instance,
            classes,
            btnUrl,
            subjectIconUrl,
            taskDate: date,
            userSession,
          },
          userAgentByIds[user].center.id
        )
        .then(() => {
          console.log(`Email enviado a ${userAgentByIds[user].email}`);
        })
        .catch((e) => {
          console.error(e);
        });
    }
  } catch (e) {}
}

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

      instance.assignable.asset.url =
        (hostname || ctx.request.header.origin) +
        leemons.getPlugin('leebrary').services.assets.getCoverUrl(instance.assignable.asset.id);

      const _classes = _.uniqBy(classesData, 'subject.id');
      const userAgentByIds = _.keyBy(userAgents, 'id');

      let subjectIconUrl =
        // eslint-disable-next-line no-nested-ternary
        _classes.length > 1
          ? `${hostname || ctx.request.header.origin}/public/assets/svgs/module-three.svg`
          : _classes[0].subject.icon.cover
          ? (hostname || ctx.request.header.origin) +
            leemons.getPlugin('leebrary').services.assets.getCoverUrl(_classes[0].subject.icon.id)
          : null;

      subjectIconUrl = null;

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
                    userAgents: _.compact(_.uniq(teachers).concat(user)),
                  }
                )
              );
            });

            await Promise.all(roomsPromises);

            sendEmail(
              instance,
              userAgentByIds,
              user,
              _classes,
              `${hostname || ctx.request.header.origin}/private/assignables/ongoing`,
              subjectIconUrl,
              {
                ...userSession,
                avatarUrl: (hostname || ctx.request.header.origin) + userSession.avatar,
              }
            );

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

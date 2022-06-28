const _ = require('lodash');
const dayjs = require('dayjs');
dayjs.extend(require('dayjs/plugin/localeData'));
const getAssignableInstance = require('../assignableInstance/getAssignableInstance');
const { registerDates } = require('../dates');
const { assignations } = require('../tables');
const registerGrade = require('../grades/registerGrade');
const { validateAssignation } = require('../../helpers/validators/assignation');

async function sendEmail(instance, userAgentByIds, user, classes, btnUrl) {
  try {
    /*
    const userAssignableInstances = await searchAssignableInstances(
      {
        limit: 4,
        archived: false,
        evaluated: false,
      },
      {
        userSession: { userAgents: [{ id: user }] },
      }
    );

     */

    leemons
      .getPlugin('emails')
      .services.email.sendAsEducationalCenter(
        userAgentByIds[user].user.email,
        'user-create-assignation',
        userAgentByIds[user].user.locale,
        {
          instance,
          classes,
          btnUrl,
          taskDate: dayjs(instance.dates.deadline)
            .locale(userAgentByIds[user].user.locale)
            .format('l'),
        },
        userAgentByIds[user].center.id
      )
      .then(() => {
        console.log(`Email enviado a ${userAgentByIds[user].email}`);
      })
      .catch((e) => {
        console.error(e);
      });
  } catch (e) {}
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

      const academicPortfolioServices = leemons.getPlugin('academic-portfolio').services;
      const classesData = await academicPortfolioServices.classes.classByIds(instance.classes, {
        userSession,
        transacting,
      });

      instance.assignable.asset.url =
        ctx.request.header.origin +
        leemons.getPlugin('leebrary').services.assets.getCoverUrl(instance.assignable.asset.id);
      const _classes = _.uniqBy(classesData, 'subject.id');
      const userAgentByIds = _.keyBy(userAgents, 'id');

      try {
        const { indexable, classes, group, grades, timestamps, status, metadata } = options;

        // EN: Create the assignation
        // ES: Crea la asignación
        return await Promise.all(
          users.map(async (user) => {
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

            console.log(instance);

            if (instance.dates.deadline) {
              sendEmail(
                instance,
                userAgentByIds,
                user,
                _classes,
                `${ctx.request.header.origin}/private/assignables/ongoing`
              );
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

const _ = require('lodash');

const { getInstance } = require('../getInstance');
const { prepareEmailPerStudent } = require('../sendEmail/helpers/prepareEmailPerStudent');
const { sendEmail } = require('../sendEmail/helpers/sendMail');

/**
 * Sends a reminder to users.
 *
 * @param {Object} params - The params object.
 * @param {string} params.assignableInstanceId - The ID of the assignable instance.
 * @param {Array} params.users - The list of user IDs to send the reminder to.
 * @param {string} params.type - The type of reminder to send.
 * @param {MoleculerContext} params.ctx - The Moleculer context.
 * @returns {Promise<void[]>} A promise that resolves when the reminders have been sent.
 */
async function sendReminder({ assignableInstanceId, users, type, ctx }) {
  const [instance, hostname, hostnameAPI] = await Promise.all([
    getInstance({
      id: assignableInstanceId,
      details: true,
      ctx,
    }),
    ctx.tx.call('users.platform.getHostname'),
    ctx.tx.call('users.platform.getHostnameApi'),
  ]);

  const userAgentIds = _.map(instance.students, 'user');
  let finalUsers = users && users.length ? users : userAgentIds;

  if (type) {
    const assignationIds = _.map(instance.students, 'id');
    const assignationsById = _.keyBy(instance.students, 'id');

    const dats = await ctx.tx.db.Dates.find({
      type: 'assignation',
      instance: assignationIds,
      name: type,
    }).lean();

    const assignationIdsToSend = _.map(dats, 'instance');
    const finalAssignationIds = _.difference(assignationIds, assignationIdsToSend);

    finalUsers = [];
    _.forEach(finalAssignationIds, (assignationId) => {
      finalUsers.push(assignationsById[assignationId].user);
    });
  }

  const [classesData, userAgents] = await Promise.all([
    ctx.tx.call('academic-portfolio.classes.classByIds', {
      ids: instance.classes,
      withTeachers: true,
    }),
    ctx.tx.call('users.users.getUserAgentsInfo', {
      userAgentIds: finalUsers,
      withCenter: true,
      userColumns: ['id', 'email', 'locale'],
    }),
  ]);

  const _classes = _.uniqBy(classesData, 'subject.id');

  const contexts = (
    await Promise.all(
      userAgents.map(async (userAgent) => {
        return prepareEmailPerStudent({
          instance,
          userAgent,
          classes: _classes,
          hostname,
          hostnameAPI,

          isReminder: true,
          ignoreUserConfig: true,
          ctx,
        });
      })
    )
  ).filter((context) => context !== null);

  return Promise.all(contexts.map((context) => sendEmail({ ...context, ctx })));
}

module.exports = { sendReminder };

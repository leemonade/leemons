const dayjs = require('dayjs');

const { JOBS } = require('../../../services/jobs/instances.job');

const { prepareEmailPerStudent } = require('./helpers/prepareEmailPerStudent');
const { sendEmail } = require('./helpers/sendMail');

module.exports = async function scheduleEmail({ instance, userAgents, classes, ctx }) {
  const [hostname, hostnameAPI] = await Promise.all([
    ctx.tx.call('users.platform.getHostname'),
    ctx.tx.call('users.platform.getHostnameApi'),
  ]);

  const { alwaysAvailable, dates } = instance;
  const hasStarted = alwaysAvailable || dayjs(dates.start).isBefore(dayjs());

  const contexts = await Promise.all(
    userAgents.map(async (userAgent) => {
      return prepareEmailPerStudent({
        instance,
        userAgent,
        classes,
        hostname,
        hostnameAPI,

        isReminder: false,
        ctx,
      });
    })
  );

  const contextsToSend = contexts.filter((context) => context !== null);

  if (!contextsToSend.length) {
    return;
  }

  if (hasStarted) {
    await Promise.all(contexts.map((context) => sendEmail({ ...context, ctx })));
  } else {
    await ctx.cronJob.schedule(dates.start, JOBS.FREE.SEND_ACTIVITY_START_EMAIL, {
      contexts,
      instanceId: instance.id,
      deploymentID: ctx.meta.deploymentID,
    });
  }
};

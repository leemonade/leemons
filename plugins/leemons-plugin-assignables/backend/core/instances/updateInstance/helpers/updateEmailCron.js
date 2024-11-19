const { uniqBy } = require('lodash');

const { JOBS } = require('../../../../services/jobs/instances.job');
const scheduleEmail = require('../../sendEmail/scheduleEmail');

async function updateEmailCron({ newInstance, savedInstance, mergedInstance, ctx }) {
  const startDateHasChanged = newInstance.dates.start !== savedInstance.dates.start;

  if (startDateHasChanged) {
    await ctx.cronJob.cancel(JOBS.FREE.SEND_ACTIVITY_START_EMAIL, {
      'data.deploymentID': ctx.meta.deploymentID,
      'data.instanceId': savedInstance.id,
    });

    if (mergedInstance.sendMail) {
      const users = mergedInstance.students.map((student) => student.user);

      const [userAgents, classesData] = await Promise.all([
        ctx.tx.call('users.users.getUserAgentsInfo', {
          userAgentIds: users,
          userColumns: ['id', 'email', 'avatar', 'locale'],
          withCenter: true,
        }),
        ctx.tx.call('academic-portfolio.classes.classByIds', {
          ids: mergedInstance.classes,
          withTeachers: true,
        }),
      ]);

      await scheduleEmail({
        instance: mergedInstance,
        userAgents,
        classes: uniqBy(classesData, 'subject.id'),
        ctx,
      });
    }
  }
}

module.exports = { updateEmailCron };

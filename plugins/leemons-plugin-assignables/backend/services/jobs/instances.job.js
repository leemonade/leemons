const { VERSION, PLUGIN_NAME } = require('../../config/constants');
const { sendEmail } = require('../../core/instances/sendEmail/helpers/sendMail');

const JOBS = {
  FREE: {
    SEND_ACTIVITY_START_EMAIL: `v${VERSION}.${PLUGIN_NAME}:send-activity-start-email`,
  },
};

const jobs = {
  [JOBS.FREE.SEND_ACTIVITY_START_EMAIL]: async (ctx) => {
    const { contexts } = ctx.params;

    await Promise.all(contexts.map((context) => sendEmail({ ...context, ctx })));
  },
};

module.exports = {
  jobs,
  JOBS,
};

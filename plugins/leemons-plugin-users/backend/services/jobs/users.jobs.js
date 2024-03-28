const { VERSION, PLUGIN_NAME } = require('../../config/constants');

const JOBS = {
  FREE: {
    SEND_TEACHER_FIRST_STEPS_GUIDE_EMAIL: `v${VERSION}.${PLUGIN_NAME}:FREE:send-teacher-first-steps-guide-email`,
    SEND_TEACHER_ASSIGNMENTS_GUIDE_EMAIL: `v${VERSION}.${PLUGIN_NAME}:FREE:send-teacher-assignments-guide-email`,
    SEND_TEACHER_EVALUATIONS_GUIDE_EMAIL: `v${VERSION}.${PLUGIN_NAME}:FREE:send-teacher-evaluations-guide-email`,
  },
};

const SEND_EMAIL_SERVICE = 'emails.email.sendAsPlatform';

// -----------------------------------------------
// JOBS DEFINITIONS

const jobs = {
  [JOBS.FREE.SEND_TEACHER_FIRST_STEPS_GUIDE_EMAIL]: (ctx) => {
    const { to, language, platformUrl } = ctx.params;

    const payload = {
      to,
      templateName: 'teacher-first-steps-guide-free',
      language: language ?? 'en',
      context: {
        loginUrl: platformUrl,
      },
    };

    ctx.call(SEND_EMAIL_SERVICE, payload);
  },
  [JOBS.FREE.SEND_TEACHER_ASSIGNMENTS_GUIDE_EMAIL]: (ctx) => {
    const { to, language, platformUrl } = ctx.params;

    const payload = {
      to,
      templateName: 'teacher-assignments-guide-free',
      language: language ?? 'en',
      context: {
        loginUrl: platformUrl,
      },
    };

    ctx.call(SEND_EMAIL_SERVICE, payload);
  },
  [JOBS.FREE.SEND_TEACHER_EVALUATIONS_GUIDE_EMAIL]: (ctx) => {
    const { to, language, platformUrl } = ctx.params;

    const payload = {
      to,
      templateName: 'teacher-evaluation-guide-free',
      language: language ?? 'en',
      context: {
        loginUrl: platformUrl,
      },
    };

    ctx.call(SEND_EMAIL_SERVICE, payload);
  },
};

module.exports = { jobs, JOBS };

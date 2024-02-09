const { getEmailTypes } = require('@leemons/emails');
const { render } = require('@react-email/components');

const NewAssignation = require('../../emails/UserNewAssignation.jsx');
const RememberAssignation = require('../../emails/UserRemenberAssignation.jsx');
const rememberActivityTimeout = require('../../emails/userRememberAssignationTimeout');
const userWeekly = require('../../emails/userWeekly');

const ADD_TEMPLATE_SERVICE_NAME = 'emails.email.addIfNotExist';

async function initEmails({ ctx }) {
  await ctx.tx.call(ADD_TEMPLATE_SERVICE_NAME, {
    templateName: 'user-create-assignation',
    language: 'es',
    subject: 'Nueva actividad',
    html: render(NewAssignation.default({ locale: 'es' })),
    type: getEmailTypes().active,
  });

  await ctx.tx.call(ADD_TEMPLATE_SERVICE_NAME, {
    templateName: 'user-create-assignation',
    language: 'en',
    subject: 'New activity',
    html: render(NewAssignation.default({ locale: 'en' })),
    type: getEmailTypes().active,
  });

  await ctx.tx.call(ADD_TEMPLATE_SERVICE_NAME, {
    templateName: 'user-assignation-remember',
    language: 'es',
    subject: 'Recordatorio de actividad',
    html: render(RememberAssignation.default({ locale: 'es' })),
    type: getEmailTypes().active,
  });

  await ctx.tx.call(ADD_TEMPLATE_SERVICE_NAME, {
    templateName: 'user-assignation-remember',
    language: 'en',
    subject: 'Activity reminder',
    html: render(RememberAssignation.default({ locale: 'en' })),
    type: getEmailTypes().active,
  });

  ctx.tx.call(ADD_TEMPLATE_SERVICE_NAME, {
    templateName: 'user-remember-assignation-timeout',
    language: 'es',
    subject: 'Esta actividad finaliza pronto',
    html: rememberActivityTimeout.es,
    type: getEmailTypes().active,
  });

  ctx.tx.call(ADD_TEMPLATE_SERVICE_NAME, {
    templateName: 'user-remember-assignation-timeout',
    language: 'en',
    subject: 'This activity ends soon',
    html: rememberActivityTimeout.en,
    type: getEmailTypes().active,
  });

  ctx.tx.call(ADD_TEMPLATE_SERVICE_NAME, {
    templateName: 'user-weekly-resume',
    language: 'es',
    subject: 'Aquí tienes tus actividades pendientes',
    html: userWeekly.es,
    type: getEmailTypes().active,
  });

  ctx.tx.call(ADD_TEMPLATE_SERVICE_NAME, {
    templateName: 'user-weekly-resume',
    language: 'en',
    subject: 'Have a look to your pending activities',
    html: userWeekly.en,
    type: getEmailTypes().active,
  });

  ctx.tx.emit('init-emails');
}

module.exports = {
  initEmails,
};

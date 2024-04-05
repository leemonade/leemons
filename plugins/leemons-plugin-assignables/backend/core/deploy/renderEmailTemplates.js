const { getEmailTypes } = require('@leemons/emails');
const { render } = require('@react-email/components');

const { default: NewAssignation } = require('../../emails/UserNewAssignation.jsx');
const { default: RememberAssignation } = require('../../emails/UserRememberAssignation.jsx');
const rememberActivityTimeout = require('../../emails/userRememberAssignationTimeout');
const userWeekly = require('../../emails/userWeekly');

function renderEmailTemplates() {
  return [
    {
      templateName: 'user-create-assignation',
      language: 'es',
      subject: 'Nueva actividad',
      html: render(NewAssignation({ locale: 'es' })),
      type: getEmailTypes().active,
    },
    {
      templateName: 'user-create-assignation',
      language: 'en',
      subject: 'New activity',
      html: render(NewAssignation({ locale: 'en' })),
      type: getEmailTypes().active,
    },
    {
      templateName: 'user-assignation-remember',
      language: 'es',
      subject: 'Recordatorio de actividad',
      html: render(RememberAssignation({ locale: 'es' })),
      type: getEmailTypes().active,
    },
    {
      templateName: 'user-assignation-remember',
      language: 'en',
      subject: 'Activity reminder',
      html: render(RememberAssignation({ locale: 'en' })),
      type: getEmailTypes().active,
    },
    {
      templateName: 'user-remember-assignation-timeout',
      language: 'es',
      subject: 'Esta actividad finaliza pronto',
      html: rememberActivityTimeout.es,
      type: getEmailTypes().active,
    },
    {
      templateName: 'user-remember-assignation-timeout',
      language: 'en',
      subject: 'This activity ends soon',
      html: rememberActivityTimeout.en,
      type: getEmailTypes().active,
    },
    {
      templateName: 'user-weekly-resume',
      language: 'es',
      subject: 'Aquí tienes tus actividades pendientes',
      html: userWeekly.es,
      type: getEmailTypes().active,
    },
    {
      templateName: 'user-weekly-resume',
      language: 'en',
      subject: 'Have a look to your pending activities',
      html: userWeekly.en,
      type: getEmailTypes().active,
    },
  ];
}

module.exports = {
  renderEmailTemplates,
};

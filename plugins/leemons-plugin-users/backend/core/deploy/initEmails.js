const { getEmailTypes } = require('@leemons/emails');
const { render } = require('@react-email/components');
const RecoverPassword = require('../../emails/RecoverPassword.jsx');
const ResetPassword = require('../../emails/ResetPassword.jsx');
const Welcome = require('../../emails/Welcome.jsx');
const NewProfileAdded = require('../../emails/NewProfileAdded.jsx');

const ADD_TEMPLATE_SERVICE_NAME = 'emails.email.addIfNotExist';

async function initEmails({ ctx }) {
  await ctx.tx.call(ADD_TEMPLATE_SERVICE_NAME, {
    templateName: 'user-recover-password',
    language: 'es',
    subject: 'Recuperar contraseña',
    html: render(RecoverPassword.default({ locale: 'es' })),
    type: getEmailTypes().active,
  });

  await ctx.tx.call(ADD_TEMPLATE_SERVICE_NAME, {
    templateName: 'user-recover-password',
    language: 'en',
    subject: 'Password Recovery',
    html: render(RecoverPassword.default({ locale: 'en' })),
    type: getEmailTypes().active,
  });

  ctx.tx.emit('init-email-recover-password');

  await ctx.tx.call(ADD_TEMPLATE_SERVICE_NAME, {
    templateName: 'user-reset-password',
    language: 'es',
    subject: 'Su contraseña ha sido restablecida',
    html: render(ResetPassword.default({ locale: 'es' })),
    type: getEmailTypes().active,
  });

  await ctx.tx.call(ADD_TEMPLATE_SERVICE_NAME, {
    templateName: 'user-reset-password',
    language: 'en',
    subject: 'Your password has been reset',
    html: render(ResetPassword.default({ locale: 'en' })),
    type: getEmailTypes().active,
  });

  await ctx.tx.call(ADD_TEMPLATE_SERVICE_NAME, {
    templateName: 'user-welcome',
    language: 'es',
    subject: 'Bienvenida',
    html: render(Welcome.default({ locale: 'es' })),
    type: getEmailTypes().active,
  });

  await ctx.tx.call(ADD_TEMPLATE_SERVICE_NAME, {
    templateName: 'user-welcome',
    language: 'en',
    subject: 'Welcome',
    html: render(Welcome.default({ locale: 'en' })),
    type: getEmailTypes().active,
  });

  await ctx.tx.call(ADD_TEMPLATE_SERVICE_NAME, {
    templateName: 'user-new-profile-added',
    language: 'es',
    subject: 'Nuevo perfil',
    html: render(NewProfileAdded.default({ locale: 'es' })),
    type: getEmailTypes().active,
  });

  await ctx.tx.call(ADD_TEMPLATE_SERVICE_NAME, {
    templateName: 'user-new-profile-added',
    language: 'en',
    subject: 'New profile',
    html: render(NewProfileAdded.default({ locale: 'en' })),
    type: getEmailTypes().active,
  });

  ctx.tx.emit('init-email-reset-password');
  ctx.tx.emit('init-emails');
}

module.exports = {
  initEmails,
};

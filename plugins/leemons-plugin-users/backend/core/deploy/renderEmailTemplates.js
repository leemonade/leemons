const { getEmailTypes } = require('@leemons/emails');
const { render } = require('@react-email/components');
const { default: RecoverPassword } = require('../../emails/RecoverPassword.jsx');
const { default: ResetPassword } = require('../../emails/ResetPassword.jsx');
const { default: Welcome } = require('../../emails/Welcome.jsx');
const { default: NewProfileAdded } = require('../../emails/NewProfileAdded.jsx');

function renderEmailTemplates() {
  return [
    {
      templateName: 'user-recover-password',
      language: 'es',
      subject: 'Recuperar contraseña',
      html: render(RecoverPassword({ locale: 'es' })),
      type: getEmailTypes().active,
    },
    {
      templateName: 'user-recover-password',
      language: 'en',
      subject: 'Password Recovery',
      html: render(RecoverPassword({ locale: 'en' })),
      type: getEmailTypes().active,
    },
    {
      templateName: 'user-reset-password',
      language: 'es',
      subject: 'Su contraseña ha sido restablecida',
      html: render(ResetPassword({ locale: 'es' })),
      type: getEmailTypes().active,
    },
    {
      templateName: 'user-reset-password',
      language: 'en',
      subject: 'Your password has been reset',
      html: render(ResetPassword({ locale: 'en' })),
      type: getEmailTypes().active,
    },
    {
      templateName: 'user-welcome',
      language: 'es',
      subject: 'Bienvenida',
      html: render(Welcome({ locale: 'es' })),
      type: getEmailTypes().active,
    },
    {
      templateName: 'user-welcome',
      language: 'en',
      subject: 'Welcome',
      html: render(Welcome({ locale: 'en' })),
      type: getEmailTypes().active,
    },
    {
      templateName: 'user-new-profile-added',
      language: 'es',
      subject: 'Nuevo perfil',
      html: render(NewProfileAdded({ locale: 'es' })),
      type: getEmailTypes().active,
    },
    {
      templateName: 'user-new-profile-added',
      language: 'en',
      subject: 'New profile',
      html: render(NewProfileAdded({ locale: 'en' })),
      type: getEmailTypes().active,
    },
  ];
}

module.exports = {
  renderEmailTemplates,
};

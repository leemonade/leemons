function recoverPassword(name, title, time, btn, btnNo, noCall, limitExp) {
  return `
  <html>
    <head>
      <style></style>
    </head>
     <body>
     <h1>${name}</h1>
     <h5>${title}</h5>
     <p>${time}</p>
     <a href="{{it.resetUrl}}">${btn}</a>
     <p>${btnNo}</p>
     {{it.resetUrl}}
     <p>${noCall}</p>
     <p>${limitExp}</p>
     </body>
  </html>
  `;
}

module.exports = {
  es: recoverPassword(
    'Hola {{it.name}}',
    'Se ha solicitado el restablecimiento de la contraseña de su cuenta.',
    'Haga clic en el siguiente botón para cambiar su contraseña. Este enlace caducará en 15 minutos * y solo puede utilizarse una vez.',
    'Cambiar mi contraseña',
    'Si el botón anterior no funciona, pegue este enlace en su navegador:',
    'Si no ha solicitado el restablecimiento de su contraseña, puede ignorar este correo electrónico.',
    '* Una vez transcurrido el plazo, tendrá que volver a enviar la solicitud de restablecimiento de contraseña.. Para obtener un nuevo enlace de restablecimiento de contraseña, visite {{it.recoverUrl}}'
  ),
  en: recoverPassword(
    'Hi {{it.name}}',
    'A password reset for your account was requested.',
    'Please click the button below to change your password. This link will expire in 15 minutes * and can only be used once.',
    'Change my password',
    'If the button above doesn’t work, paste this link into your web browser:',
    'If you did not ask to reset your password you can ignore this email.',
    '* After the time limit has expired, you will have to resubmit the request for a password reset.. To get a new password reset link, visit {{it.recoverUrl}}'
  ),
};

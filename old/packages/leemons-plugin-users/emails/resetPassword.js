function resetPassword(name, title, time, btn, endText) {
  return `
  <html>
    <head>
      <style></style>
    </head>
     <body>
     <h1>${name}</h1>
     <h5>${title}</h5>
     <p>${time}</p>
     <a href="{{it.loginUrl}}">${btn}</a>
     <p>${endText}</p>
     </body>
  </html>
  `;
}

module.exports = {
  es: resetPassword(
    'Hola {{it.name}}',
    'Tu contraseña ha sido restablecida.',
    'Queríamos informarte de que tu contraseña de Leemons ha sido restablecida.',
    'Ir a iniciar sesion',
    'Por favor, no responda a este correo electrónico con su contraseña. Nunca le pediremos su contraseña, y le desaconsejamos que la comparta con nadie'
  ),
  en: resetPassword(
    'Hi {{it.name}}',
    'Your password was reset.',
    'We wanted to let you know that your Leemons password was reset.',
    'Go to Log in',
    'Please do not reply to this email with your password. We will never ask for your password, and we strongly discourage you from sharing it with anyone'
  ),
};

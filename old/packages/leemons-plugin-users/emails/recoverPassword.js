function welcome(title, t1, t2, t3, t4, t5, t6, t7) {
  return `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <meta name="robots" content="noindex,nofollow">
    <meta property="og:title" content="leemons">

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href='https://fonts.googleapis.com/css?family=Lexend' rel='stylesheet'>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700&display=swap" rel="stylesheet">


    <style type="text/css">
        body {
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
        }

        h1, h2, p {
            margin: 0 !important;
        }
    </style>
</head>
<body class="body" bgcolor="#fff" style="background-color: #fff;">
    <table cellpadding="0" cellspacing="0" align="center" width="100%" bgcolor="#fff" style="max-width: 600px">
        <tr>
            <td>
                <table cellpadding="0" cellspacing="0" align="center" width="100%" bgcolor="#F7F8FA" style="background-color: #F7F8FA;">
                    <tr>
                        <td style="padding: 10px 0;">
                        </td>
                    </tr>
                </table>

                <table cellpadding="0" cellspacing="0" align="center" width="100%" bgcolor="#F7F8FA" style="background-color: #F7F8FA;">
                    <tr>
                      <td align="center" style="text-align: center; padding: 10px 45px; font-family:'Lexend', Century Gothic,CenturyGothic,AppleGothic,sans-serif; font-size: 20px; line-height: 25px; font-weight: 400; color: #212B3D;">
                          ${title}
                      </td>
                    </tr>
                    <tr>
                        <td align="center" style="text-align: center; padding: 10px 45px 25px; font-family: 'Lexend', Century Gothic,CenturyGothic,AppleGothic,sans-serif;">
                            <img
                            src="{{it.__logoUrl}}"
                            width="{{it.__logoWidth}}"
                            />
                        </td>
                    </tr>

                    <tr>
                        <td align="center" style="text-align: center; padding: 10px 45px 25px; font-family: 'Inter', Verdana, sans-serif; font-size: 16px; line-height: 20px; font-weight: 600; color: #212B3D;">
                            ${t1}
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="text-align: center; padding: 10px 45px; font-family: 'Lexend', Century Gothic,CenturyGothic,AppleGothic,sans-serif;">
                            <a href="{{it.resetUrl}}" target="_blank" style="text-decoration: none; font-size: 14px; line-height: 18px; font-weight: 600; color: #fff; background-color: #3B76CC; padding: 10px 30px; border-radius: 25px; font-family: 'Lexend', Century Gothic,CenturyGothic,AppleGothic,sans-serif;">
                                ${t2}
                            </a>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="text-align: center; padding: 25px 45px; font-family: 'Lexend', Century Gothic,CenturyGothic,AppleGothic,sans-serif; font-size: 14px; line-height: 22px; font-weight: 400; color: #5B6577;">
                            ${t3}
                        </td>
                    </tr>
                </table>

                <table cellpadding="0" cellspacing="0" align="center" width="100%" bgcolor="#F7F8FA" style="background-color: #F7F8FA;">
                    <tr>
                        <td align="center" style="text-align: center; padding: 15px 25px;">
                            <table cellpadding="0" cellspacing="0" align="center" width="100%" bgcolor="#fff" style="background-color: #fff;">
                                <tr>
                                    <td align="center" style="text-align: center; padding: 25px 25px 8px; font-family: 'Inter', Verdana, sans-serif; font-size: 14px; line-height: 22px; font-weight: 400; color: #5B6577;">
                                        ${t4}
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="text-align: center; padding: 8px 25px; font-family: 'Inter', Verdana, sans-serif; font-size: 14px; line-height: 22px; font-weight: 400; color: #5B6577;">
                                        <a href="{{it.resetUrl}}" target="_blank" style="font-size: 14px; line-height: 18px; font-weight: 400; color: #3B76CC; padding: 10px; font-family: 'Lexend', Century Gothic,CenturyGothic,AppleGothic,sans-serif;">
                                            {{it.resetUrl}}
                                        </a>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="text-align: center; padding: 8px 25px 25px; font-family: 'Inter', Verdana, sans-serif; font-size: 13px; line-height: 16px; font-weight: 400; color: #636D7D;">
                                        ${t5}
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
                <table cellpadding="0" cellspacing="0" align="center" width="100%" bgcolor="#F7F8FA" style="background-color: #F7F8FA;">
                    <tr>
                        <td align="center" style="text-align: center; padding-top: 18px">
                        ${t6}
                        </td>
                    </tr>

                </table>
                <table cellpadding="0" cellspacing="0" align="center" width="100%" bgcolor="#F7F8FA" style="background-color: #F7F8FA;">
                    <tr>
                        <td align="center" style="text-align: center; padding: 20px 25px 85px;">
                            <a href="#" target="_blank" style="text-decoration: none; font-family: 'Inter', Verdana, sans-serif; font-size: 14px; line-height: 18px; font-weight: 400; color: #636D7D;">
                                ${t7}
                            </a>
                        </td>
                    </tr>
                </table>

            </td>
        </tr>
    </table>
</body>
</html>
  `;
}

module.exports = {
  es: welcome(
    '{{it.__platformName}}',
    'Haz clic en el siguiente enlace para recuperar tu contraseña:',
    'Recuperar contraseña',
    'Este enlace caducará en 15 minutos * y solo puede utilizarse una vez.',
    'Si el botón anterior no funciona, pegue este enlace en su navegador web',
    'Si no ha hecho esta solicitud, puede ignorar este correo electrónico.',
    'Enviado por {{it.__from}}',
    '' // Política de privacidad
  ),
  en: welcome(
    '{{it.__platformName}}',
    'Click the following link to recover your password:',
    'Recover password',
    'This link will expire in 15 minutes * and can only be used once.',
    'If the above button does not work, paste this link into your web browser.',
    'If you have not made this request, you may ignore this email.',
    'Sent by {{it.__from}}',
    '' // Privacy Policy.
  ),
};

/*
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


 */

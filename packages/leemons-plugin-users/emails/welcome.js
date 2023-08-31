function welcome(title, t1, t2, t3, t4, t5, t6) {
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
                            <a href="{{it.url}}" target="_blank" style="text-decoration: none; font-size: 14px; line-height: 18px; font-weight: 600; color: #fff; background-color: #3B76CC; padding: 10px 30px; border-radius: 25px; font-family: 'Lexend', Century Gothic,CenturyGothic,AppleGothic,sans-serif;">
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
                                        <a href="{{it.url}}" target="_blank" style="font-size: 14px; line-height: 18px; font-weight: 400; color: #3B76CC; padding: 10px; font-family: 'Lexend', Century Gothic,CenturyGothic,AppleGothic,sans-serif;">
                                            {{it.url}}
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
                        <td align="center" style="text-align: center; padding: 20px 25px;">
                            <a href="#" target="_blank" style="text-decoration: none; font-family: 'Inter', Verdana, sans-serif; font-size: 14px; line-height: 18px; font-weight: 400; color: #636D7D;">
                                ${t6}
                            </a>
                        </td>
                    </tr>
                </table>
                <table cellpadding="0" cellspacing="0" align="center" width="100%" bgcolor="#F7F8FA" style="background-color: #F7F8FA;">
                    <tr>
                        <td style="padding: 50px 0;">
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
    'Te damos la bienvenida a {{it.__platformName}}',
    'Haga clic en el siguiente enlace para crear su contraseña y acceder a su cuenta',
    'Configurar cuenta',
    'Este enlace caducará en {{it.expDays}} días y sólo puede utilizarse una vez.',
    'Si el botón anterior no funciona, pegue este enlace en su navegador web',
    'Si no ha hecho esta solicitud, puede ignorar este correo electrónico.',
    '' // Política de privacidad
  ),
  en: welcome(
    'Welcome to {{it.__platformName}}',
    'Click on the following link to create your password and access your account',
    'Set up account',
    'This link will expire in {{it.expDays}} days and can only be used once.',
    'If the button above doesn’t work, paste this link into your web browser',
    'If you did not make this request, you can safely ignore this email.',
    '' // Privacy policy
  ),
};

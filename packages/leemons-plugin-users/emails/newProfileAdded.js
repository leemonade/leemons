function newProfileAdded(title, t1, t2) {
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
                </table>
                <table cellpadding="0" cellspacing="0" align="center" width="100%" bgcolor="#F7F8FA" style="background-color: #F7F8FA;">
                    <tr>
                        <td align="center" style="text-align: center; padding: 20px 25px;">
                            <a href="#" target="_blank" style="text-decoration: none; font-family: 'Inter', Verdana, sans-serif; font-size: 14px; line-height: 18px; font-weight: 400; color: #636D7D;">
                                ${t2}
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
  es: newProfileAdded(
    'Hola, {{it.userName}}',
    'Te han añadido al perfil de {{it.profileName}}',
    '' // Política de privacidad
  ),
  en: newProfileAdded(
    'Hi, {{it.userName}}',
    'You have been added to the profile of {{it.profileName}}',
    '' // Privacy policy
  ),
};

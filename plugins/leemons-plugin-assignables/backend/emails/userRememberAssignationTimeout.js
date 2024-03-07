function activity(title, t1, t2, t3, t4, t5, texts) {
  return `
  <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <meta name="robots" content="noindex,nofollow" />
    <meta property="og:title" content="leemons" />

    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css?family=Lexend"
      rel="stylesheet"
    />
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700&display=swap"
      rel="stylesheet"
    />

    <style type="text/css">
      body {
        margin: 0 !important;
        padding: 0 !important;
        width: 100% !important;
      }

      h1,
      h2,
      p {
        margin: 0 !important;
      }
    </style>
  </head>
  <body class="body" bgcolor="#fff" style="background-color: #fff">
    <table
      cellpadding="0"
      cellspacing="0"
      align="center"
      width="100%"
      bgcolor="#fff"
      style="max-width: 600px"
    >
      <tr>
        <td>
          <table
            cellpadding="0"
            cellspacing="0"
            align="center"
            width="100%"
            bgcolor="#F7F8FA"
            style="background-color: #f7f8fa"
          >
            <tr>
              <td style="padding: 10px 0"></td>
            </tr>
          </table>

          <table
            cellpadding="0"
            cellspacing="0"
            align="center"
            width="100%"
            bgcolor="#F7F8FA"
            style="background-color: #f7f8fa"
          >
          <tr>
              <td
                align="center"
                style="
                  text-align: center;
                  padding: 32px 45px 0px;
                  font-family: 'Lexend', Century Gothic, CenturyGothic,
                    AppleGothic, sans-serif;
                  font-size: 20px;
                  line-height: 25px;
                  font-weight: 400;
                  color: #212b3d;
                "
              >
                ${title}
              </td>
            </tr>
            <tr>
              <td
                align="center"
                style="
                  text-align: center;
                  padding: 10px 45px 0px;
                  font-family: 'Lexend', Century Gothic, CenturyGothic,
                    AppleGothic, sans-serif;
                "
              >
               <img
                  src="{{it.__logoUrl}}"
                  width="{{it.__logoWidth}}"
                />
              </td>
            </tr>
            <tr>
            <td
                align="center"
                style="
                  text-align: center;
                  padding: 24px 45px 32px;
                  font-family: 'Inter', Verdana, sans-serif;
                  font-size: 14px;
                  line-height: 22.4px;
                  color: #5b6577;
                "
              >
               ${t1}
              </td>
            </tr>
          </table>
          <table
        cellpadding="0"
        cellspacing="0"
        align="center"
        width="100%"
        bgcolor="#F7F8FA"
        style="background-color: #f7f8fa"
      >
        <tr>
          <td align="center" style="text-align: center; padding: 15px 25px">
            <table
              cellpadding="0"
              cellspacing="0"
              align="center"
              width="100%"
              bgcolor="#fff"
              style="background-color: #fff"
            >
              <!-- CARTA -->
              <tr>
                <td align="center" style="padding-top: 24px">
                  <div
                    style="
                          background-color: white;
                          border-radius: 4px;
                          border: 2px solid #f7f8fa;
                          filter: drop-shadow(0px 5px 15px rgba(0, 0, 0, 0.1));
                          width: 354px;
                          height: 352px;
                        "
                  >
                    <div
                      style="width: 100%; height: 180px; position: relative; background-size: cover; background-image: url('{{ it.asset.url }}')"
                    >
                      <div style="display: flex;height: 100%">
                        <div
                          style="
                              width: 100%;
                              height: 100%;
                              background: rgba(247, 248, 250, 0.8);
                              backdrop-filter: blur(20px);
                              border-top-left-radius: 2px;
                            "
                        >
                          <div
                            style="
                                display: flex;
                                height: 100%;
                                justify-content: flex-end;
                                border-top: 8px solid #dc5571;
                              "
                          >
                            <div
                              style="
                                  text-align: start;
                                  padding: 12px;
                                "
                            >
                              <div
                                style="
                                    display: flex;
                                    gap: 8px;
                                    margin-top: 8px;
                                    margin-bottom: 8px;
                                    align-items: center;
                                  "
                              >

                                <span
                                  style="
                                      font-family: 'Inter', Verdana, sans-serif;
                                      font-size: 13px;
                                      line-height: 20px;
                                       width: 135px;
                                       padding-left: 8px;
                                        "
                                >
                                {{ @if (it.classes.length === 1) }}
                                    {{ it.classes[0].subject.name }}
                                {{ #else }}
                                  ${texts.multiSubjects}
                                {{ /if}}
                                    </span>
                              </div>
                              <span
                                style="
                                    display: block;
                                    font-family: 'Lexend', Verdana, sans-serif;
                                    font-size: 16px;
                                    line-height: 20px;
                                    font-weight: 600;
                                    color: #212b3d;
                                    margin-top: 8px;

                                  "
                              >{{it.asset.name}}</span>
                            </div>
                          </div>
                        </div>
                        <div
                          style="
                              background-color: white;
                              text-align: left;
                              padding: 8px;
                              height: 50px;
                              width: 100%;
                              margin-top: 130px;
                            "
                        >
                          <div
                            style="
                                font-family: 'Inter', Verdana, sans-serif;
                                font-size: 12px;
                                line-height: 20px;
                                font-weight: 600;
                                color: #d13b3b;
                              "
                          >${texts.expDays}
                          </div
                          >
                          {{ @if (it.taskDate) }}
                             <div
                            style="
                                font-family: 'Inter', Verdana, sans-serif;
                                font-size: 12.5px;
                                line-height: 14px;
                                color: #5b6577;
                              "
                          >${texts.delivery}: {{it.taskDate}}
                          </div>
                           {{ /if}}

                        </div>
                      </div>
                    </div>
                    <div style="padding: 16px; text-align: start">
                          <span
                            style="
                              font-family: 'Inter', Verdana, sans-serif;
                              font-size: 12.5px;
                              line-height: 16.5px;
                              color: #5b6577;
                            "
                          >{{ @if (it.asset.description) }}
                             {{ it.asset.description }}
                           {{ /if}}</span>
                    </div>
                  </div>
                </td>
              </tr>

              <!-- BOTON -->
              <tr>
                <td
                  align="center"
                  style="
                        text-align: center;
                        padding: 16px 45px 0px;
                        height: 38px;
                        font-family: 'Lexend', Century Gothic, CenturyGothic,
                          AppleGothic, sans-serif;
                      "
                >
                  <a
                    href="{{it.btnUrl}}"
                    target="_blank"
                    style="
                          text-decoration: none;
                          font-size: 14px;
                          line-height: 18px;
                          font-weight: 600;
                          color: #fff;
                          background-color: #3b76cc;
                          padding: 10px 32px;
                          border-radius: 25px;
                          font-family: 'Lexend', Century Gothic, CenturyGothic,
                            AppleGothic, sans-serif;
                        "
                  >
                    ${t2}
                  </a>
                </td>
              </tr>
              <!-- TEXT -->
              <tr>
                <td
                  align="center"
                  style="
                        text-align: center;
                        padding: 16px 24px 24px;
                        font-family: 'Inter', Century Gothic, CenturyGothic,
                          AppleGothic, sans-serif;
                        font-size: 14px;
                        line-height: 22px;
                        font-weight: 400;
                        color: #5b6577;
                      "
                >
                  ${t3}
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
          <table
            cellpadding="0"
            cellspacing="0"
            align="center"
            width="100%"
            bgcolor="#F7F8FA"
            style="
              background-color: #f7f8fa;
              font-family: 'Inter', Century Gothic, CenturyGothic, AppleGothic,
                sans-serif;
              font-size: 14px;
              line-height: 18.2px;
              font-weight: 400;
              color: #5b6577;
            "
          >
            <tr>
              <td align="center" style="text-align: center; padding-top: 18px">
                ${t4}
              </td>
            </tr>

          </table>
          <table
            cellpadding="0"
            cellspacing="0"
            align="center"
            width="100%"
            bgcolor="#F7F8FA"
            style="background-color: #f7f8fa"
          >
            <tr>
              <td
                align="center"
                style="text-align: center; padding: 26px 25px 32px"
              >
                <a
                  href="#"
                  target="_blank"
                  style="
                    text-decoration: none;
                    font-family: 'Inter', Verdana, sans-serif;
                    font-size: 14px;
                    line-height: 18px;
                    font-weight: 400;
                    color: #636d7d;
                  "
                >
                  ${t5}
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
  es: activity(
    'Esta actividad finaliza pronto',
    'Esta información puede haber cambiado, revisa siempre tus actividades en curso para no perderte nada.',
    'Revisar mis actividades',
    'Puedes cambiar tus preferencias de correo desde tu cuenta de usuario.',
    'Enviado por {{it.__from}}',
    '', // Política de privacidad
    {
      delivery: 'Entrega',
      expDays: 'Dentro de {{it.hours}} horas',
      multiSubjects: 'Multi-Asignatura',
    }
  ),
  en: activity(
    'This activity ends soon',
    "This information may have changed, always check your current activities so you don't miss anything.",
    'Review my activities',
    'You can change your email preferences from your user account',
    'Sent to {{it.__from}}',
    '', // Privacy policy
    {
      delivery: 'Delivery',
      expDays: 'In {{it.hours}} horas',
      multiSubjects: 'Multi-Subject',
    }
  ),
};

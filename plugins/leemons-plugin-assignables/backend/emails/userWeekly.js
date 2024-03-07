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
              <!-- TABLA -->
              {{ @if (it.nextInstances.length > 0) }}
              <tr>
                <td
                  align="center"
                  style="padding-top: 16px; padding-bottom: 24px; padding-inline: 38.5px"
                >
                  <div
                    style="
                          text-align: start;
                        "
                  >
                        <span
                          style="
                            padding: 5px 16px 8px;
                            font-family: 'Inter', Verdana, sans-serif;
                            font-size: 14px;
                            line-height: 24px;
                            font-weight: 600;
                            color: #212b3d;
                          "
                        >${texts.upcomingDeliveries}</span>
                        <table border="0" cellspacing="0" cellpadding="0">
                        {{@each(it.nextInstances) => instance}}
                          <tr>
                          <td style="border-top: 2px solid #edeff5; padding: 6px; padding-left: 16px;">
                            <div style="border: 1px solid #b9bec4">
                              <img
                                height="36"
                                width="36"
                                src="{{instance.asset.url}}"
                                style="object-fit: cover;"
                                alt="&nbsp;"
                              />
                            </div>
                            </td>
                          <td style="border-top: 2px solid #edeff5; padding: 6px;">
                            <span
                              style="
                                    font-family: 'Inter', Verdana, sans-serif;
                                    font-size: 14px;
                                    line-height: 16px;
                                    color: #212b3d;
                                  "
                            >{{instance.asset.name}}</span>
                            </td>
                          <td style="border-top: 2px solid #edeff5; padding: 6px;">
                              <div
                                style="
                                      margin-left: 10px;
                                      height: 26px;
                                      width: 26px;
                                      border-radius: 50%;
                                      background-color: {{ @if (instance.classes.length === 1) }}{{ instance.classes[0].color }};{{ #else }}#67728E;{{ /if}}
                                    "
                              ></div>
                            </td>
                          <td style="border-top: 2px solid #edeff5; padding: 6px;">
                            <span
                              style="
                                    font-family: 'Inter', Verdana, sans-serif;
                                    font-size: 14px;
                                    line-height: 16px;
                                    color: #212b3d;
                                  "
                            >
                            {{ @if (instance.classes.length === 1) }}
                                    {{ instance.classes[0].subject.name }}
                                {{ #else }}
                                  ${texts.multiSubjects}
                                {{ /if}}
                            </span>
                            </td>
                          <td style="border-top: 2px solid #edeff5; padding: 6px; padding-right: 16px;">
                            <span
                              style="
                                    font-family: 'Lexend', Verdana, sans-serif;
                                    font-size: 14px;
                                    line-height: 16px;
                                    font-weight: 500;
                                    color: {{instance.timeColor}};
                                  "
                            >
                                ${texts.expStart} {{instance.time}} {{ @if (instance.timeUnit === 'days') }}
                                    {{@if (instance.time === 1)}}${texts.expDay} {{#else}}${texts.expDays} {{/if}}
                                {{ #else }}
                                  {{@if (instance.time === 1)}}${texts.expHour} {{#else}}${texts.expHours} {{/if}}
                                {{ /if}}
                            </span>
                            </td>
                          </tr>
                        {{/each}}
                         </table>
                  </div>
                </td>
              </tr>
              {{ /if }}

              {{ @if (it.evaluatedInstances.length > 0) }}
              <tr>
                <td
                  align="center"
                  style="padding-top: 16px; padding-bottom: 24px; padding-inline: 38.5px"
                >
                <div
                    style="
                          text-align: start;
                        "
                  >
                        <span
                          style="
                            padding: 5px 16px 8px;
                            font-family: 'Inter', Verdana, sans-serif;
                            font-size: 14px;
                            line-height: 24px;
                            font-weight: 600;
                            color: #212b3d;
                          "
                        >${texts.activitiesEvaluated}</span>
                        <table border="0" cellspacing="0" cellpadding="0">
                        {{@each(it.evaluatedInstances) => instance}}
                          <tr>
                          <td style="border-top: 2px solid #edeff5; padding: 6px; padding-left: 16px;">
                                <div style="border: 1px solid #b9bec4">
                                  <img
                                    height="36"
                                    width="36"
                                    src="{{instance.asset.url}}"
                                    style="object-fit: cover;"
                                    alt="&nbsp;"
                                  />
                                </div>
                            </td>
                            <td style="border-top: 2px solid #edeff5; padding: 6px;">
                                <span style="
                                    font-family: 'Inter', Verdana, sans-serif;
                                    font-size: 14px;
                                    line-height: 16px;
                                    color: #212b3d;
                                  ">{{instance.asset.name}}</span>
                            </td>
                            <td style="border-top: 2px solid #edeff5; padding: 6px;">
                              <div style="
                                      margin-left: 10px;
                                      height: 26px;
                                      width: 26px;
                                      border-radius: 50%;
                                      background-color: {{ @if (instance.classes.length === 1) }}{{ instance.classes[0].color }};{{ #else }}#67728E;{{ /if}}
                                    "></div>
                            </td>
                            <td style="border-top: 2px solid #edeff5; padding: 6px;">
                              <span style="
                                      font-family: 'Inter', Verdana, sans-serif;
                                      font-size: 14px;
                                      line-height: 16px;
                                      color: #212b3d;
                                    ">
                              {{ @if (instance.classes.length === 1) }}
                                      {{ instance.classes[0].subject.name }}
                                  {{ #else }}
                                    ${texts.multiSubjects}
                                  {{ /if}}
                              </span>
                            </td>
                            <td style="border-top: 2px solid #edeff5; padding: 6px; padding-right: 16px;">
                              <span style="
                                      margin-left: 25px;
                                      font-family: 'Lexend', Verdana, sans-serif;
                                      font-size: 14px;
                                      line-height: 16px;
                                      font-weight: 500;
                                      color: #212b3d;
                                    ">
                                 {{instance.note}}
                              </span>
                            </td>
                          </tr>
                        {{/each}}
                        </table>

                  </div>
                </td>
              </tr>
              {{ /if }}
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
    'Aquí tienes tus actividades pendientes',
    'Esta información puede haber cambiado, revisa siempre tus actividades en curso para no perderte nada.',
    'Revisar mis actividades',
    'Puedes cambiar tus preferencias de correo desde tu cuenta de usuario.',
    'Enviado por {{it.__from}}',
    '', // Política de privacidad
    {
      upcomingDeliveries: 'Próximas actividades',
      activitiesEvaluated: 'Actividades evaluadas',
      expStart: 'dentro de',
      expDays: 'días',
      expDay: 'día',
      expHours: 'horas',
      expHour: 'hora',
      multiSubjects: 'Multi-Asignatura',
    }
  ),
  en: activity(
    'Have a look to your pending activities',
    "This information may have changed, always check your current activities so you don't miss anything.",
    'Review my activities',
    'You can change your email preferences from your user account',
    'Sent to {{it.__from}}',
    '', // Privacy policy
    {
      upcomingDeliveries: 'Upcoming deliveries',
      activitiesEvaluated: 'Activities evaluated',
      expStart: 'within',
      expDays: 'days',
      expDay: 'day',
      expHours: 'hours',
      expHour: 'hour',
      multiSubjects: 'Multi-Subject',
    }
  ),
};

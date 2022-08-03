/* eslint-disable no-param-reassign */
const _ = require('lodash');

const intlOptions = { year: 'numeric', month: 'numeric', day: 'numeric' };

function diffHours(dt2, dt1) {
  let diff = (dt2.getTime() - dt1.getTime()) / 1000;
  diff /= 60 * 60;
  return Math.abs(Math.round(diff));
}

async function sendRememberEmails() {
  // eslint-disable-next-line global-require
  const table = require('../tables');
  const emailsServices = leemons.getPlugin('emails').services;
  const now = new Date();
  const future = new Date();
  future.setTime(future.getTime() + 72 * 60 * 60 * 1000);
  // Sacamos las instancias cuya fecha de vencimiento es mayor a la actual y menor que dentro de 72 horas
  let instances = await table.dates.find(
    {
      type: 'assignableInstance',
      name: 'deadline',
      $where: [
        { date_$gt: global.utils.sqlDatetime(now) },
        { date_$lt: global.utils.sqlDatetime(future) },
      ],
    },
    { columns: ['instance', 'date'] }
  );
  const dateByInstanceId = _.reduce(
    instances,
    (acc, { instance, date }) => {
      acc[instance] = date;
      return acc;
    },
    {}
  );
  instances = _.map(instances, 'instance');

  // De las instancias sacadas, sacamos las asignaciones a los que aun no se les ha mandado el email de recordatorio
  let assignations = await table.assignations.find(
    {
      instance_$in: instances,
      $or: [{ rememberEmailSended_$ne: true }, { rememberEmailSended_$null: true }],
    },
    { columns: ['id', 'user', 'instance'] }
  );

  const [endAssignations, userAgents, _userAgents, finalInstances] = await Promise.all([
    // De todas las asignaciones que podrian necesitar mandar el email de recordatorio comprobamos cuales ya han sido finalizadas por el usuario para no mandar el email
    table.dates.find(
      {
        type: 'assignation',
        instance_$in: _.map(assignations, 'id'),
        name: 'end',
      },
      { columns: ['instance'] }
    ),
    // Sacamos la configuracion de los emails de recordatorio de todos los usuarios para ver si quieren que se les mande y cuando quede cuanto tiempo
    emailsServices.config.getValuesForUserAgentsAndKey(
      _.uniq(_.map(assignations, 'user')),
      'new-assignation-timeout-email'
    ),
    // Sacamos el detalle de los user agent ya que lo necesitamos para enviar el email
    leemons
      .getPlugin('users')
      .services.users.getUserAgentsInfo(_.uniq(_.map(assignations, 'user')), {
        withCenter: true,
        userColumns: ['id', 'email', 'locale'],
      }),
    table.assignableInstances.find({
      id_$in: _.uniq(_.map(assignations, 'instance')),
    }),
  ]);

  console.log(finalInstances);

  const userAgentByIds = _.keyBy(_userAgents, 'id');
  const endAssignationsIds = _.map(endAssignations, 'instance');

  // Sacamos las asignaciones que no han sido finalizadas
  assignations = _.filter(
    assignations,
    (assignation) => !_.includes(endAssignationsIds, assignation.id)
  );

  // Nos recorremos las asignaciones y comprobamos si el usuario quiere que se le mande el email de recordatorio y si falta el tiempo que ha especificado
  const promises = [];
  _.forEach(assignations, (assignation) => {
    const userAgentHours = userAgents[assignation.user];
    const instanceDate = dateByInstanceId[assignation.instance];
    // Si el usuario quiere que se le mande el email de recordatorio y falta menos tiempo del que el usuario quiere que se le avise se le mande email
    if (userAgentHours && diffHours(now, new Date(instanceDate)) <= userAgentHours) {
      const dateTimeFormat2 = new Intl.DateTimeFormat(
        userAgentByIds[assignation.user].user.locale,
        intlOptions
      );
      const date = dateTimeFormat2.format(new Date(instanceDate));

      /*
      emailsServices.email
        .sendAsEducationalCenter(
          userAgentByIds[assignation.user].user.email,
          'user-create-assignation',
          userAgentByIds[assignation.user].user.locale,
          {
            instance,
            classes,
            btnUrl,
            subjectIconUrl,
            taskDate: date,
          },
          userAgentByIds[assignation.user].center.id
        )
        .then(() => {
          console.log(`Email enviado a ${userAgentByIds[user].email}`);
        })
        .catch((e) => {
          console.error(e);
        });

       */
    }
  });
}

module.exports = { sendRememberEmails };

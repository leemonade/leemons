/* eslint-disable no-param-reassign */
const _ = require('lodash');
const getAsset = require('../leebrary/assets/getAsset');

const intlOptions = { year: 'numeric', month: 'numeric', day: 'numeric' };

async function sendRememberEmails() {
  // eslint-disable-next-line global-require
  const table = require('../tables');
  const academicPortfolioServices = leemons.getPlugin('academic-portfolio').services;
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
  if (instances.length) {
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

    const [endAssignations, userAgents, _userAgents, finalInstances, _classes, hostname] =
      await Promise.all([
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
        table.classes.find({
          assignableInstance_$in: _.uniq(_.map(assignations, 'instance')),
        }),
        leemons.getPlugin('users').services.platform.getHostname(),
      ]);

    const assignables = await table.assignables.find({
      id_$in: _.uniq(_.map(finalInstances, 'assignable')),
    });

    const assets = await getAsset(_.map(assignables, 'asset'));

    const assetById = _.keyBy(assets, 'id');
    const instanceById = _.keyBy(finalInstances, 'id');
    const assignableById = _.keyBy(assignables, 'id');

    const classes = await academicPortfolioServices.classes.classByIds(
      _.uniq(_.map(_classes, 'class'))
    );
    const classesById = _.keyBy(classes, 'id');

    const instanceClasses = _.reduce(
      _classes,
      (acc, { assignableInstance, class: classe }) => {
        if (!acc[assignableInstance]) acc[assignableInstance] = [];
        if (_.map(acc[assignableInstance], 'id').indexOf(classe) === -1) {
          acc[assignableInstance].push(classesById[classe]);
        }
        return acc;
      },
      {}
    );
    const userAgentByIds = _.keyBy(_userAgents, 'id');
    const endAssignationsIds = _.map(endAssignations, 'instance');

    // Sacamos las asignaciones que no han sido finalizadas
    assignations = _.filter(
      assignations,
      (assignation) => !_.includes(endAssignationsIds, assignation.id)
    );

    // Nos recorremos las asignaciones y comprobamos si el usuario quiere que se le mande el email de recordatorio y si falta el tiempo que ha especificado
    _.forEach(assignations, (assignation) => {
      const userAgentHours = userAgents[assignation.user];
      const instanceDate = dateByInstanceId[assignation.instance];
      const hours = global.utils.diffHours(now, new Date(instanceDate));
      // Si el usuario quiere que se le mande el email de recordatorio y falta menos tiempo del que el usuario quiere que se le avise se le mande email
      if (userAgentHours && hours <= userAgentHours) {
        const instance = instanceById[assignation.instance];
        const assignable = assignableById[instance.assignable];
        const asset = assetById[assignable.asset];
        const dateTimeFormat2 = new Intl.DateTimeFormat(
          userAgentByIds[assignation.user].user.locale,
          intlOptions
        );
        const date = dateTimeFormat2.format(new Date(instanceDate));

        asset.url =
          hostname + leemons.getPlugin('leebrary').services.assets.getCoverUrl(assignable.asset);

        emailsServices.email
          .sendAsEducationalCenter(
            userAgentByIds[assignation.user].user.email,
            'user-remember-assignation-timeout',
            userAgentByIds[assignation.user].user.locale,
            {
              asset,
              instance,
              classes: _.uniqBy(instanceClasses[instance.id], 'subject.id'),
              btnUrl: `${hostname}/private/assignables/ongoing`,
              taskDate: date,
              hours,
            },
            userAgentByIds[assignation.user].center.id
          )
          .then(() => {
            console.log(
              `Email remember assignation sended to ${userAgentByIds[assignation.user].user.email}`
            );
            table.assignations.update(
              { id: assignation.id },
              {
                rememberEmailSended: true,
              }
            );
          })
          .catch((e) => {
            console.error(e);
          });
      }
    });
  } else {
    console.info('[Remember email] Nothing to send');
  }
}

module.exports = { sendRememberEmails };

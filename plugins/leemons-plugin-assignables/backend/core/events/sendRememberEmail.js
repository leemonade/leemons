/* eslint-disable no-param-reassign */
const _ = require('lodash');

const { sqlDatetime, diffHours } = require('@leemons/utils');

const getAsset = require('../leebrary/assets/getAsset');

const intlOptions = { year: 'numeric', month: 'numeric', day: 'numeric' };

async function sendRememberEmails({ ctx }) {
  const now = new Date();
  const future = new Date();
  future.setTime(future.getTime() + 72 * 60 * 60 * 1000);
  // Sacamos las instancias cuya fecha de vencimiento es mayor a la actual y menor que dentro de 72 horas
  let instances = await ctx.tx.db.Dates.find({
    type: 'assignableInstance',
    name: 'deadline',
    date: { $gt: sqlDatetime(now), $lt: sqlDatetime(future) },
  })
    .select(['instance', 'date'])
    .lean();
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
    let assignations = await ctx.tx.db.Assignations.find({
      instance: instances,
      $or: [{ rememberEmailSended: { $ne: true } }, { rememberEmailSended: null }],
    })
      .select(['id', 'user', 'instance'])
      .lean();

    const [endAssignations, userAgents, _userAgents, finalInstances, _classes, hostname] =
      await Promise.all([
        // De todas las asignaciones que podrian necesitar mandar el email de recordatorio comprobamos cuales ya han sido finalizadas por el usuario para no mandar el email
        ctx.tx.db.Dates.find({
          type: 'assignation',
          instance: _.map(assignations, 'id'),
          name: 'end',
        })
          .select(['instance'])
          .lean(),
        // Sacamos la configuracion de los emails de recordatorio de todos los usuarios para ver si quieren que se les mande y cuando quede cuanto tiempo
        ctx.tx.call('emails.config.getValuesForUserAgentsAndKey', {
          userAgents: _.uniq(_.map(assignations, 'user')),
          key: 'new-assignation-timeout-email',
        }),
        // Sacamos el detalle de los user agent ya que lo necesitamos para enviar el email
        ctx.tx.call('users.users.getUserAgentsInfo', {
          userAgentIds: _.uniq(_.map(assignations, 'user')),
          withCenter: true,
          userColumns: ['id', 'email', 'locale'],
        }),
        ctx.tx.db.Instances.find({
          id: _.map(assignations, 'instance'),
        }).lean(),
        ctx.tx.db.Classes.find({
          assignableInstance: _.uniq(_.map(assignations, 'instance')),
        }).lean(),
        ctx.tx.call('users.platform.getHostname'),
      ]);

    const assignables = await ctx.tx.db.Assignables.find({
      id: _.uniq(_.map(finalInstances, 'assignable')),
    }).lean();

    const assets = await getAsset(_.map(assignables, 'asset'));

    const assetById = _.keyBy(assets, 'id');
    const instanceById = _.keyBy(finalInstances, 'id');
    const assignableById = _.keyBy(assignables, 'id');

    const classes = await ctx.tx.call('academic-portfolio.classes.classByIds', {
      ids: _.uniq(_.map(assignables, 'class')),
    });

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
    const assignationPromises = _.map(assignations, async (assignation) => {
      const userAgentHours = userAgents[assignation.user];
      const instanceDate = dateByInstanceId[assignation.instance];
      const hours = diffHours(now, new Date(instanceDate));
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
          hostname +
          (await ctx.tx.call('leebrary.assets.getCoverUrl', {
            assetId: assignable.asset,
          }));
        ctx.tx
          .call('emails.email.sendAsEducationalCenter', {
            to: userAgentByIds[assignation.user].user.email,
            templateName: 'user-remember-assignation-timeout',
            language: userAgentByIds[assignation.user].user.locale,
            context: {
              asset,
              instance,
              classes: _.uniqBy(instanceClasses[instance.id], 'subject.id'),
              btnUrl: `${hostname}/private/assignables/ongoing`,
              taskDate: date,
              hours,
            },
            centerId: userAgentByIds[assignation.user].center.id,
          })
          .then(async () => {
            ctx.logger.debug(
              `Email remember assignation sended to ${userAgentByIds[assignation.user].user.email}`
            );
            await ctx.tx.db.Assignations.updateOne(
              { id: assignation.id },
              {
                rememberEmailSended: true,
              }
            );
          })
          .catch((e) => {
            ctx.logger.error(e);
          });
      }
    });
    await Promise.all(assignationPromises);
    ctx.logger.info('[Remember email] Emails sended');
  } else {
    ctx.logger.info('[Remember email] Nothing to send');
  }
}

module.exports = { sendRememberEmails };

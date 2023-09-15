// const { getByIds } = require('packages/leemons-plugin-leebrary/services/assets');
const { byIds } = require('./byIds');
const { getMessageIdsByFilters } = require('./getMessageIdsByFilters');

async function getActive({ data, userAgent: _userAgent, ids: _ids, ctx }) {
  const { userSession } = ctx.meta;
  let userAgent = _userAgent;
  let ids = _ids;

  if (!userAgent) {
    [userAgent] = await ctx.tx.call('users.users.getUserAgentsInfo', {
      userAgentIds: userSession.userAgents[0].id,
      userColumns: ['id'],
      withProfile: true,
    });
  }

  if (!ids) {
    ids = await getMessageIdsByFilters({
      item: {
        profiles: [userAgent.profile.id],
        centers: data.center ? [data.center] : null,
        programs: data.program ? [data.program] : null,
        classes: data.class ? [data.class] : null,
      },
      ctx,
    });
  }
  // Si no hay ids es que no hay ninguna configuración para los filtros especificados
  if (ids === null) return null;

  // Buscamos si ya tenemos publicado alguna de las configuraciones
  const activeConfig = await ctx.tx.db.MessageConfig.findOne({
    id: ids,
    zone: data.zone,
    status: 'published',
  }).lean();

  // Si hay alguno publicado comprobamos que la fecha fin no haya pasado ya
  if (activeConfig) {
    const now = new Date();
    // Si ya ha pasado la fecha fin marcamos la configuración como finalizada
    if (now > activeConfig.endDate) {
      await ctx.tx.db.MessageConfig.updateOne({ id: activeConfig.id }, { status: 'completed' });
      // Una vez actualizado volvemos a llamarnos para volver a pasar por todos los procesos de comprobación de si hay programada alguna configuración en la fecha actual.
      return getActive({ data, userAgent, ids, ctx });
    }
    // Si la fecha fin aun no ha pasado es el evento activo actual, lo devolvemos
    return (await byIds({ ids: activeConfig.id, ctx }))[0];
  }
  // Si no hay configuración activa, vamos a comprobar si alguna de las programadas tiene la fechas entre hoy
  const now = new Date();
  let config = await ctx.tx.db.MessageConfig.findOne({
    id: ids,
    zone: data.zone,
    status: 'programmed',
    startDate: { $lte: now },
    endDate: { $gt: now },
  }).lean();

  // Si hemos encontrado alguna configuración la marcamos como activa para que la proxima vez se haga menos logica
  if (config) {
    config.status = 'published';
    await ctx.tx.db.MessageConfig.updateOne({ id: config.id }, { status: 'published' });
    [config] = await byIds({ ids: config.id, ctx });
  }

  return config;
}

module.exports = { getActive };

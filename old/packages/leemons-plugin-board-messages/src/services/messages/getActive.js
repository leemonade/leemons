// const { getByIds } = require('packages/leemons-plugin-leebrary/services/assets');
const { table } = require('../tables');
const { byIds } = require('./byIds');
const { getMessageIdsByFilters } = require('./getMessageIdsByFilters');

async function getActive(data, { userSession, transacting, _userAgent, _ids } = {}) {
  let userAgent = _userAgent;
  let ids = _ids;

  if (!userAgent) {
    [userAgent] = await leemons
      .getPlugin('users')
      .services.users.getUserAgentsInfo(userSession.userAgents[0].id, {
        userColumns: ['id'],
        withProfile: true,
        transacting,
      });
  }

  if (!ids) {
    ids = await getMessageIdsByFilters({
      profiles: [userAgent.profile.id],
      centers: data.center ? [data.center] : null,
      programs: data.program ? [data.program] : null,
      classes: data.class ? [data.class] : null,
    });
  }
  // Si no hay ids es que no hay ninguna configuración para los filtros especificados
  if (ids === null) return null;

  // Buscamos si ya tenemos publicado alguna de las configuraciones
  const activeConfig = await table.messageConfig.findOne(
    {
      id_$in: ids,
      zone: data.zone,
      status: 'published',
    },
    { transacting }
  );

  // Si hay alguno publicado comprobamos que la fecha fin no haya pasado ya
  if (activeConfig) {
    const now = new Date();
    // Si ya ha pasado la fecha fin marcamos la configuración como finalizada
    if (now > activeConfig.endDate) {
      await table.messageConfig.update(
        { id: activeConfig.id },
        { status: 'completed' },
        { transacting }
      );
      // Una vez actualizado volvemos a llamarnos para volver a pasar por todos los procesos de comprobación de si hay programada alguna configuración en la fecha actual.
      return getActive(data, { userSession, transacting, _userAgent: userAgent, _ids: ids });
    }
    // Si la fecha fin aun no ha pasado es el evento activo actual, lo devolvemos
    return (await byIds(activeConfig.id))[0];
  }
  // Si no hay configuración activa, vamos a comprobar si alguna de las programadas tiene la fechas entre hoy
  const now = new Date();
  let config = await table.messageConfig.findOne(
    {
      id_$in: ids,
      zone: data.zone,
      status: 'programmed',
      startDate_$lte: now,
      endDate_$gt: now,
    },
    { transacting }
  );

  // Si hemos encontrado alguna configuración la marcamos como activa para que la proxima vez se haga menos logica
  if (config) {
    config.status = 'published';
    await table.messageConfig.update({ id: config.id }, { status: 'published' }, { transacting });
    [config] = await byIds(config.id);
  }

  return config;
}

module.exports = { getActive };

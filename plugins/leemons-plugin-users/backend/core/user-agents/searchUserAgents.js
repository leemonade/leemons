const _ = require('lodash');
const { LeemonsError } = require('@leemons/error');
const { getUserAgentsInfo } = require('./getUserAgentsInfo');

/**
 * Returns all agents that meet the specified parameters.
 * @public
 * @static
 * @param {
 * {
 *    profile: string | undefined,
 *    program: string | undefined,
 *    course: string | undefined,
 *    user: {
 *      name: string | undefined,
 *      surnames: string | undefined,
 *      secondSurname: string | undefined,
 *      email: string | undefined
 *    } | undefined}
 * } filters - To search
 * @param {any=} transacting - DB Transaction
 * @return {Promise<boolean>}
 * */

async function searchUserAgents({
  profile,
  center,
  user,
  program,
  course,
  ignoreUserIds,
  withProfile,
  withCenter,
  userColumns,
  onlyContacts,
  queryWithContains = true,
  ctx,
}) {
  const { userSession } = ctx.meta;
  const finalQuery = {};
  // ES: Como es posible que se quiera filtrar desde multiples sitios por usuarios añadimos un array
  // de ids de usuarios para luego filtrar los agentes
  // Ejemplo: Queremos sacar los usuarios que tengan un email que contenga gmail.com y en los que su
  // campo de dataset la edad sea 22, todas esas ids de usuarios que coincidan deben ir eneste array
  // EN: As it is possible that you may want to filter from multiple sites by users, we add an array
  // of user ids to filter the agents.
  // Example: We want to get the users that have an email containing gmail.com and where their
  // dataset field age is 22, all those matching user ids should go in this array
  let userIds = [];
  let addUserIdsToQuery = false;

  let centerRoles = [];
  let profileRoles = [];

  // ES: Si nos viene center sacamos todos los roles del centro y se los pasamos como query para
  // solo sacar los agentes que esten en dicho centro
  // EN: If we get a center, we extract all the roles of the center and pass them as a query to
  // extract only the agents that are in that center.
  if (center) {
    centerRoles = await ctx.tx.db.RoleCenter.find({
      center: _.isArray(center) ? center : [center],
    })
      .select(['role'])
      .lean();
    centerRoles = _.map(centerRoles, 'role');
  }

  // ES: Si nos viene perfil sacamos todos los roles del perfil y se los pasamos como query para
  // solo sacar los agentes que esten en dicho perfil
  // EN: If we get a profile, we extract all the roles of the profile and pass them as a query to
  // extract only the agents that are in that profile.
  if (profile) {
    profileRoles = await ctx.tx.db.ProfileRole.find({
      profile: _.isArray(profile) ? profile : [profile],
    })
      .select(['role'])
      .lean();
    profileRoles = _.map(profileRoles, 'role');
  }

  if (onlyContacts) {
    if (!userSession) {
      throw new LeemonsError(ctx, { message: 'User session is required to get contacts' });
    }
    // eslint-disable-next-line global-require
    const { getUserAgentContacts } = require('./contacts/getUserAgentContacts');

    // ES: Si solo queremos los contactos de un usuario, lo buscamos y lo añadimos a la query
    const userAgentContacts = await getUserAgentContacts({
      fromUserAgent: _.map(userSession.userAgents, 'id'),
      ctx,
    });

    finalQuery.id = userAgentContacts; // _.map(userAgentContacts, 'toUserAgent');
  }

  // ES: Si solo viene perfil o solo viene centro se pasan sus respectivos roles para solo sacar
  // los agentes con dichos roles, pero si vienen ambos (perfil y centro) solo tenemos que sacar
  // aquellos agentes donde el rol exista tanto en el centro como en el perfil
  // EN: If only profile or only center comes, their respective roles are passed to only get the
  // agents with those roles, but if both come (profile and center) we only have to get those agents
  // where the role exists both in the center and in the profile.
  let queryRoles = [];
  if (profile || center) {
    if (profile) queryRoles = profileRoles;
    if (center) queryRoles = centerRoles;
    if (profile && center) queryRoles = _.intersection(centerRoles, profileRoles);
    finalQuery.role = queryRoles;
  }

  // ES: Si nos viene el user nos montamos la consulta para sacar todos los usuarios que cumplan con
  // las condiciones y asi luego filtrar los agentes para que solo saque los de dichos usuarios
  // EN: If we get the user we set up the query to get all the users that meet the conditions and
  // then filter the agents to get only those of those users.
  if (user && (user.name || user.surnames || user.email)) {
    const query = { $or: [] };
    if (queryWithContains) {
      if (user.name) query.$or.push({ name: { $regex: user.name, $options: 'i' } });
      if (user.surnames) query.$or.push({ surnames: { $regex: user.surnames, $options: 'i' } });
      if (user.email) query.$or.push({ email: { $regex: user.email, $options: 'i' } });
      if (user.secondSurname)
        query.$or.push({ secondSurname: { $regex: user.secondSurname, $options: 'i' } });
    } else {
      if (user.name) query.$or.push({ name: user.name });
      if (user.surnames) query.$or.push({ surnames: user.surnames });
      if (user.email) query.$or.push({ email: user.email });
      if (user.secondSurname) query.$or.push({ secondSurname: user.secondSurname });
    }
    const users = await ctx.tx.db.Users.find(query).select(['id']).lean();
    userIds = userIds.concat(_.map(users, 'id'));
    addUserIdsToQuery = true;
  }

  // ES: Si alfinal hay ids de usuarios las añadimos a los filtros finales
  // EN: If there are user ids, we add them to the final filters.
  if (userIds.length || addUserIdsToQuery) {
    finalQuery.user = userIds;
  }

  // ES: Nos saltamos las ids de usuarios especificadas awui, comunmente se usara por que ya hemos
  // seleccionado dicho usuario y no queremos que vuelva a salir en el listado
  // EN: We skip the user ids specified awui, commonly used because we have already selected that
  // user and we do not want it to appear again in the list.
  if (_.isArray(ignoreUserIds) && ignoreUserIds.length) {
    finalQuery.user = { $nin: ignoreUserIds };
  }

  // ES: Finalmente sacamos los agentes con sus correspondientes usuarios según los filtros
  // EN: Finally, the agents and their corresponding users according to the filters
  let userAgents = await ctx.tx.db.UserAgent.find(finalQuery).select(['id']).lean();

  if (program) {
    const usersAgentIdsInProgram = await ctx.tx.call(
      'academic-portfolio.programs.getUsersInProgram',
      { program, course }
    );

    userAgents = _.filter(userAgents, (userAgent) => usersAgentIdsInProgram.includes(userAgent.id));
  }

  return getUserAgentsInfo({
    userAgentIds: _.map(userAgents, 'id'),
    withProfile,
    withCenter,
    userColumns,
    ctx,
  });
}

module.exports = { searchUserAgents };

const _ = require('lodash');
const { table } = require('../tables');

/**
 * Returns all agents that meet the specified parameters.
 * @public
 * @static
 * @param {
 * {
 *    profile: string | undefined,
 *    user: {
 *      name: string | undefined,
 *      surnames: string | undefined,
 *      email: string | undefined
 *    } | undefined}
 * } filters - To search
 * @param {any=} transacting - DB Transaction
 * @return {Promise<boolean>}
 * */

// TODO Añadir como parametro opcionales (Junto transacting) withProfile y withCenter y que se devuelva el perfil/centro para cada use agent
async function searchUserAgents({ profile, center, user, ignoreUserIds }, { transacting } = {}) {
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
    centerRoles = await table.roleCenter.find(
      { center },
      {
        columns: ['role'],
        transacting,
      }
    );
    centerRoles = _.map(centerRoles, 'role');
  }

  // ES: Si nos viene perfil sacamos todos los roles del perfil y se los pasamos como query para
  // solo sacar los agentes que esten en dicho perfil
  // EN: If we get a profile, we extract all the roles of the profile and pass them as a query to
  // extract only the agents that are in that profile.
  if (profile) {
    profileRoles = await table.profileRole.find(
      { profile },
      {
        columns: ['role'],
        transacting,
      }
    );
    profileRoles = _.map(profileRoles, 'role');
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
    finalQuery.role_$in = queryRoles;
  }

  // ES: Si nos viene el user nos montamos la consulta para sacar todos los usuarios que cumplan con
  // las condiciones y asi luego filtrar los agentes para que solo saque los de dichos usuarios
  // EN: If we get the user we set up the query to get all the users that meet the conditions and
  // then filter the agents to get only those of those users.
  if (user && (user.name || user.surnames || user.email)) {
    const query = { $or: [] };
    if (user.name) query.$or.push({ name_$contains: user.name });
    if (user.surnames) query.$or.push({ surnames_$contains: user.surnames });
    if (user.email) query.$or.push({ email_$contains: user.email });
    const users = await table.users.find(query, { columns: ['id'], transacting });
    userIds = userIds.concat(_.map(users, 'id'));
    addUserIdsToQuery = true;
  }

  // ES: Si alfinal hay ids de usuarios las añadimos a los filtros finales
  // EN: If there are user ids, we add them to the final filters.
  if (userIds.length || addUserIdsToQuery) {
    finalQuery.user_$in = userIds;
  }

  // ES: Nos saltamos las ids de usuarios especificadas awui, comunmente se usara por que ya hemos
  // seleccionado dicho usuario y no queremos que vuelva a salir en el listado
  // EN: We skip the user ids specified awui, commonly used because we have already selected that
  // user and we do not want it to appear again in the list.
  if (_.isArray(ignoreUserIds) && ignoreUserIds.length) {
    finalQuery.user_$nin = ignoreUserIds;
  }

  // ES: Finalmente sacamos los agentes con sus correspondientes usuarios según los filtros
  // EN: Finally, the agents and their corresponding users according to the filters
  const userAgents = await table.userAgent.find(finalQuery, {
    columns: ['id', 'user'],
    transacting,
  });

  // TODO IMAGEN Si se añade imagen añadir al array de columnas
  const users = await table.users.find(
    { id_$in: _.map(userAgents, 'user') },
    {
      columns: ['id', 'email', 'name', 'surnames', 'created_at'],
      transacting,
    }
  );

  const usersById = _.keyBy(users, 'id');

  return _.map(userAgents, (userAgent) => {
    userAgent.user = usersById[userAgent.user];
    return userAgent;
  });
}

module.exports = { searchUserAgents };

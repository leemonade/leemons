const { LeemonsError } = require('@leemons/error');
const _ = require('lodash');

const { getUserAgentsInfo } = require('./getUserAgentsInfo');

/**
 * Searches for user agents based on various criteria.
 * @public
 * @static
 * @param {Object} params - The search parameters.
 * @param {string|string[]} [params.profile] - The profile(s) to search for.
 * @param {string|string[]} [params.center] - The center(s) to search for.
 * @param {Object} [params.user] - User details to search for.
 * @param {string} [params.user.name] - The user's name.
 * @param {string} [params.user.surnames] - The user's surnames.
 * @param {string} [params.user.secondSurname] - The user's second surname.
 * @param {string} [params.user.email] - The user's email.
 * @param {string|string[]} [params.program] - The program(s) to search for.
 * @param {string|string[]} [params.course] - The course(s) to search for.
 * @param {string|string[]} [params.classes] - The class(es) to search for.
 * @param {string[]} [params.ignoreUserIds] - User IDs to exclude from the search.
 * @param {boolean} [params.withProfile] - Include profile information in the result.
 * @param {boolean} [params.withCenter] - Include center information in the result.
 * @param {string[]} [params.userColumns] - Specific user columns to include in the result.
 * @param {boolean} [params.onlyContacts] - Search only within the user's contacts.
 * @param {boolean} [params.queryWithContains=true] - Use partial matching for user fields.
 * @param {string[]} [params.emails] - Array of emails to limit the search to.
 * @param {Object} params.ctx - The context object.
 * @returns {Promise<Array>} A promise that resolves to an array of user agents matching the criteria.
 */
async function searchUserAgents({
  profile,
  center,
  user,
  program,
  course,
  classes,
  ignoreUserIds,
  withProfile,
  withCenter,
  userColumns,
  onlyContacts,
  queryWithContains = true,
  emails,
  ctx,
}) {
  const { userSession } = ctx.meta;
  const finalQuery = {};
  let userIds = [];
  let addUserIdsToQuery = false;

  let centerRoles = [];
  let profileRoles = [];

  // If we get a center, we extract all the roles of the center and pass them as a query to
  // extract only the agents that are in that center.
  if (center) {
    centerRoles = await ctx.tx.db.RoleCenter.find({
      center: _.isArray(center) ? center : [center],
    })
      .select(['role'])
      .lean();
    centerRoles = _.map(centerRoles, 'role');
  }

  // If we get a profile, we extract all the roles of the profile and pass them as a query to
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

  // If only profile or only center comes, their respective roles are passed to only get the
  // agents with those roles, but if both come (profile and center) we only have to get those agents
  // where the role exists both in the center and in the profile.
  let queryRoles = [];
  if (profile || center) {
    if (profile) queryRoles = profileRoles;
    if (center) queryRoles = centerRoles;
    if (profile && center) queryRoles = _.intersection(centerRoles, profileRoles);
    finalQuery.role = queryRoles;
  }

  // If we get the user we set up the query to get all the users that meet the conditions and
  // then filter the agents to get only those of those users.
  if (user && (user.name || user.surnames || user.email)) {
    const query = { $or: [] };
    if (queryWithContains) {
      if (user.name) query.$or.push({ name: { $regex: _.escapeRegExp(user.name), $options: 'i' } });
      if (user.surnames)
        query.$or.push({ surnames: { $regex: _.escapeRegExp(user.surnames), $options: 'i' } });
      if (user.email)
        query.$or.push({ email: { $regex: _.escapeRegExp(user.email), $options: 'i' } });
      if (user.secondSurname)
        query.$or.push({
          secondSurname: { $regex: _.escapeRegExp(user.secondSurname), $options: 'i' },
        });
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

  // If emails array is provided, limit the search to those emails
  if (emails && emails.length > 0) {
    const emailRegexes = emails.map((email) => new RegExp(`^${_.escapeRegExp(email)}$`, 'i'));
    const emailUsers = await ctx.tx.db.Users.find({ email: { $in: emailRegexes } })
      .select(['id'])
      .lean();
    const emailUserIds = _.map(emailUsers, 'id');
    userIds = userIds.length > 0 ? _.intersection(userIds, emailUserIds) : emailUserIds;
    addUserIdsToQuery = true;
  }

  // If there are user ids, we add them to the final filters.
  if (addUserIdsToQuery) {
    finalQuery.user = { $in: userIds };
  }

  // We skip the user ids specified awui, commonly used because we have already selected that
  // user and we do not want it to appear again in the list.
  if (_.isArray(ignoreUserIds)) {
    if (_.isObject(finalQuery.user)) {
      finalQuery.user.$nin = ignoreUserIds;
    } else {
      finalQuery.user = { $nin: ignoreUserIds };
    }
  }

  // Finally, the agents and their corresponding users according to the filters
  let userAgents = await ctx.tx.db.UserAgent.find(finalQuery).select(['id']).lean();

  if (program) {
    const usersAgentIdsInProgram = await ctx.tx.call(
      'academic-portfolio.programs.getUsersInProgram',
      { program, course }
    );

    userAgents = _.filter(userAgents, (userAgent) => usersAgentIdsInProgram.includes(userAgent.id));
  }

  let _classes = null;
  if (_.isArray(classes)) {
    _classes = classes;
  } else if (classes) {
    _classes = [classes];
  }

  if (_.isArray(_classes)) {
    const [students, teachers] = await Promise.all([
      ctx.tx.call('academic-portfolio.classes.studentGetByClass', {
        class: _classes,
        returnIds: true,
      }),
      ctx.tx.call('academic-portfolio.classes.teacherGetByClass', {
        class: _classes,
        returnIds: true,
      }),
    ]);
    const st = students.concat(teachers);
    userAgents = _.filter(userAgents, (userAgent) => st.includes(userAgent.id));
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

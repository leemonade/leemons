const _ = require('lodash');
const { getProfiles } = require('../settings/getProfiles');

async function getStudentsByTags(tags, { center, transacting } = {}) {
  const tagsService = leemons.getPlugin('common').services.tags;
  const userService = leemons.getPlugin('users').services.users;
  const profiles = await getProfiles({ transacting });
  const tagsValues = await tagsService.getTagsValues(tags, {
    type: 'plugins.users.user-agent',
    transacting,
  });
  const userAgentIds = await userService.filterUserAgentsByProfileAndCenter(
    _.uniq(_.flatten(tagsValues)),
    profiles.student,
    center,
    { transacting }
  );
  return userService.getUserAgentsInfo(userAgentIds, { withProfile: true, transacting });
}

module.exports = { getStudentsByTags };

const _ = require('lodash');
const { getProfiles } = require('../settings/getProfiles');

async function getStudentsByTags({ tags, center, ctx }) {
  const profiles = await getProfiles({ ctx });
  const tagsValues = await ctx.tx.call('common.tags.getTagsValues', {
    tags,
    type: 'users.user-agent',
  });
  const userAgentIds = await ctx.tx.call('users.users.filterUserAgentsByProfileAndCenter', {
    userAgentIds: _.uniq(_.flatten(tagsValues)),
    profile: profiles.student,
    center,
  });
  return ctx.tx.call('users.users.getUserAgentsInfo', {
    userAgentIds,
    withProfile: true,
  });
}

module.exports = { getStudentsByTags };

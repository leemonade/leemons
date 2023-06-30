const _ = require('lodash');

/**
 * ES: Devuelve los perfiles a los que tiene acceso el perfil especificado
 * @public
 * @static
 * @param {string|string[]} _fromProfile - Profile id/s
 * @param {boolean} returnProfile
 * @param {any=} transacting - DB Transaction
 * @return {Promise<boolean>}
 * */
async function getProfileContacts({ fromProfile: _fromProfile, returnProfile, ctx }) {
  const isArray = _.isArray(_fromProfile);
  const fromProfiles = isArray ? _fromProfile : [_fromProfile];

  const query = {
    fromProfile: fromProfiles,
  };

  let response = await ctx.tx.db.ProfileContacts.find(query).lean();

  response = _.uniqBy(response, 'toProfile');

  let profilesById = null;
  if (returnProfile) {
    const profiles = await ctx.tx.db.Profiles.find({ _id: _.map(response, 'toProfile') }).lean();
    profilesById = _.keyBy(profiles, '_id');
  }

  if (isArray) {
    const responseByFromProfile = _.groupBy(response, 'fromProfile');
    return _.map(fromProfiles, (fromProfile) =>
      _.map(responseByFromProfile[fromProfile], ({ toProfile }) => {
        if (profilesById) return profilesById[toProfile];
        return toProfile;
      })
    );
  }
  return _.map(response, ({ toProfile }) => {
    if (profilesById) return profilesById[toProfile];
    return toProfile;
  });
}

module.exports = { getProfileContacts };

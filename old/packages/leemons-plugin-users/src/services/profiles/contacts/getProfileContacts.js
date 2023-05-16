const _ = require('lodash');
const { table } = require('../../tables');

/**
 * ES: Devuelve los perfiles a los que tiene acceso el perfil especificado
 * @public
 * @static
 * @param {string|string[]} _fromProfile - Profile id/s
 * @param {boolean} returnProfile
 * @param {any=} transacting - DB Transaction
 * @return {Promise<boolean>}
 * */
async function getProfileContacts(_fromProfile, { returnProfile, transacting } = {}) {
  const isArray = _.isArray(_fromProfile);
  const fromProfiles = isArray ? _fromProfile : [_fromProfile];

  const query = {
    fromProfile_$in: fromProfiles,
  };

  let response = await table.profileContacts.find(query, { transacting });

  response = _.uniqBy(response, 'toProfile');

  let profilesById = null;
  if (returnProfile) {
    const profiles = await table.profiles.find(
      { id_$in: _.map(response, 'toProfile') },
      { transacting }
    );
    profilesById = _.keyBy(profiles, 'id');
  }

  if (isArray) {
    const responseByFromProfile = _.groupBy(response, 'fromProfile');
    return _.map(fromProfiles, (fromProfile) => {
      return _.map(responseByFromProfile[fromProfile], ({ toProfile }) => {
        if (profilesById) return profilesById[toProfile];
        return toProfile;
      });
    });
  } else {
    return _.map(response, ({ toProfile }) => {
      if (profilesById) return profilesById[toProfile];
      return toProfile;
    });
  }
}

module.exports = { getProfileContacts };

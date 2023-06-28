const _ = require('lodash');

/**
 * ES: Añade que un perfil tiene acceso a los user agent de otro perfil
 * @public
 * @static
 * @param {string|string[]} _fromProfile - Profile id/s
 * @param {string|string[]} _toProfile - Profile id/s
 * @param {any=} transacting - DB Transaction
 * @return {Promise<boolean>}
 * */
async function addProfileContact({ fromProfile: _fromProfile, toProfile: _toProfile, ctx }) {
  const fromProfiles = _.isArray(_fromProfile) ? _fromProfile : [_fromProfile];
  const toProfiles = _.isArray(_toProfile) ? _toProfile : [_toProfile];

  const promises = [];

  _.forEach(fromProfiles, (fromProfile) => {
    const gPromises = [];
    _.forEach(toProfiles, (toProfile) => {
      gPromises.push(
        ctx.tx.db.ProfileContacts.updateOne(
          {
            fromProfile,
            toProfile,
          },
          {
            fromProfile,
            toProfile,
          },
          {
            upsert: true,
          }
        )
      );
    });
    promises.push(Promise.all(gPromises));
  });

  return Promise.all(promises);
}

module.exports = { addProfileContact };

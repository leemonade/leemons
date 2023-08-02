const _ = require('lodash');
const { table } = require('../tables');
const { removeSubjectCreditsBySubjectsIds } = require('./removeSubjectCreditsBySubjectsIds');

async function removeSubjectByIds(ids, { userSession, soft, transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      const subjects = await table.subjects.find(
        { id_$in: _.isArray(ids) ? ids : [ids] },
        { transacting }
      );
      await leemons.events.emit('before-remove-subjects', { subjects, soft, transacting });
      const assetService = leemons.getPlugin('leebrary').services.assets;
      await Promise.all([
        Promise.allSettled(
          _.map(subjects, (subject) =>
            assetService.remove(
              { id: subject.image },
              {
                userSession,
                transacting,
              }
            )
          )
        ),
        Promise.allSettled(
          _.map(subjects, (subject) =>
            assetService.remove(
              { id: subject.icon },
              {
                userSession,
                transacting,
              }
            )
          )
        ),
      ]);
      await removeSubjectCreditsBySubjectsIds(_.map(subjects, 'id'), { soft, transacting });
      await table.subjects.deleteMany({ id_$in: _.map(subjects, 'id') }, { soft, transacting });
      await leemons.events.emit('after-remove-subjects', { subjects, soft, transacting });
      return true;
    },
    table.subjects,
    _transacting
  );
}

module.exports = { removeSubjectByIds };

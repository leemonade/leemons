const _ = require('lodash');
const { table } = require('../tables');

async function removeKnowledgeByIds(ids, { soft, transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      const knowledges = await table.knowledges.find(
        { id_$in: _.isArray(ids) ? ids : [ids] },
        { transacting }
      );
      await leemons.events.emit('before-remove-knowledges', { knowledges, soft, transacting });
      await table.knowledges.deleteMany({ id_$in: _.map(knowledges, 'id') }, { soft, transacting });
      await leemons.events.emit('after-remove-knowledges', { knowledges, soft, transacting });
      return true;
    },
    table.knowledges,
    _transacting
  );
}

module.exports = { removeKnowledgeByIds };

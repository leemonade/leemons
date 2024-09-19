const { mongoDBPaginate } = require('@leemons/mongodb-helpers');

const { getProgramCustomNomenclature } = require('../programs');

async function listSubjectBlocks({ page, size, subjectId, ctx }) {
  const dbData = await mongoDBPaginate({
    model: ctx.tx.db.Blocks,
    page,
    size,
    query: { subject: subjectId },
  });

  if (dbData?.items?.length > 0) {
    const programId = dbData.items[0].program;
    const nomenclature = await getProgramCustomNomenclature({
      ids: programId,
      ctx,
    });
    const localeNomenclature = nomenclature[programId];

    dbData.items = dbData.items.map((item) => {
      return {
        ...item,
        nomenclature: localeNomenclature,
      };
    });
  }

  return dbData;
}

module.exports = { listSubjectBlocks };

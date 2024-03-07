const { map } = require('lodash');
/**
 * Handle the subjects of the asset.
 * It creates a new entry in the assetsSubjects table for each subject associated with the asset.
 *
 * @async
 * @param {Object} params - The parameters object.
 * @param {Array} params.subjects - An array of subjects associated with the asset. Each subject is an object that contains the subject's data.
 * @param {string} params.assetId - The unique identifier of the asset. This is used to link the subjects to the asset in the assetsSubjects table.
 * @param {MoleculerContext} params.ctx - The moleculer context.
 */
async function handleSubjects({ subjects, assetId, ctx }) {
  return Promise.all(
    map(subjects, (subjectId) =>
      ctx.tx.db.AssetsSubjects.create({ asset: assetId, subject: subjectId }).then((mongooseDoc) =>
        mongooseDoc.toObject()
      )
    )
  );
}

module.exports = { handleSubjects };

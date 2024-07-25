const { MongoClient } = require('mongodb');

const { MONGO_URI } = process.env;

const client = new MongoClient(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

let database;

async function init() {
  try {
    await client.connect();
    database = client.db();
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
}

// ····································································································
// FUNCIONS

async function getAssetsToUpdate(leebraryAssetsCollection) {
  const leebraryCategories = database.collection('v1::leebrary_categories');
  const testCategoryIds = await leebraryCategories.distinct('id', { key: 'assignables.tests' });
  const qBankCategoryIds = await leebraryCategories.distinct('id', {
    key: 'tests-questions-banks',
  });

  return leebraryAssetsCollection
    .find({
      category: { $in: [...testCategoryIds, ...qBankCategoryIds] },
      public: { $ne: true },
    })
    .toArray();
}

async function updateAssets(assetsToUpdate, leebraryAssetsCollection) {
  const result = await leebraryAssetsCollection.updateMany(
    { id: { $in: assetsToUpdate.map((asset) => asset.id) } },
    { $set: { public: true } }
  );

  console.log(`Update results:`);
  console.log(`- Matched documents: ${result.matchedCount}`);
  console.log(`- Modified documents: ${result.modifiedCount}`);
}

// ····································································································
// MAIN

(async () => {
  try {
    await init();
    const leebraryAssetsCollection = database.collection('v1::leebrary_assets');
    const assetsToUpdate = await getAssetsToUpdate(leebraryAssetsCollection);

    if (assetsToUpdate.length === 0) {
      console.log('✨ No assets to update found.');
      await client.close();
      return;
    }
    await updateAssets(assetsToUpdate, leebraryAssetsCollection);

    await client.close();
  } catch (error) {
    console.error('ERROR', error);
    await client.close();
  }
})();

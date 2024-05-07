const { MongoClient } = require('mongodb');

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let database;

async function init() {
  await client.connect();
  database = client.db();
}

// Loop over all collections and remove all entries that have a deploymentID that is not in the passed deploymentIds array
async function cleanCollectionsNotIn(deploymentIds) {
  const collections = await database.listCollections().toArray();

  // Process only the collections that have a name that starts with "v1::"
  return Promise.all(
    collections
      .filter((collectionInfo) => collectionInfo.name.startsWith('v1::'))
      .map((collectionInfo) => {
        const collection = database.collection(collectionInfo.name);
        return collection.deleteMany({ deploymentID: { $nin: deploymentIds } });
      })
  );
}

(async () => {
  try {
    await init();
    const keepDeploymentIds = [
      '66016f43b85fefd89e579d19',
      '660431cdb85fefd89e585047',
      '66310ece16d76f12da220080',
    ];
    await cleanCollectionsNotIn(keepDeploymentIds);
    await client.close();
  } catch (error) {
    console.error('error', error);
    await client.close();
  }
})();

/*

db.getCollection("v1::academic-portfolio_groups").aggregate([
 {
    $match: {
      type: "group"
    }
  },
    {
    $lookup: {
      from: "v1::package-manager_deployments",
      localField: "deploymentID",
      foreignField: "id",
      as: "deploymentInfo"
    }
  },
  { $unwind: "$deploymentInfo" },
  { $match: { "deploymentInfo.type": { $ne: 'basic' } } },
  {
    $group: {
      _id: null,
      uniqueTypes: { $addToSet: "$abbreviation" }
    }
  }
]);

*/

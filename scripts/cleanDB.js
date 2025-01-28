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
    collections.map((collectionInfo) => {
      const collection = database.collection(collectionInfo.name);
      if (
        collectionInfo.name.startsWith('v1::') ||
        collectionInfo.name.includes('deploymentplugins')
      ) {
        return collection.deleteMany({ deploymentID: { $nin: deploymentIds } });
      }

      if (collectionInfo.name.startsWith('package-manager_deployments')) {
        return collection.deleteMany({ id: { $nin: deploymentIds } });
      }

      return true;
    })
  );
}

(async () => {
  try {
    await init();
    const keepDeploymentIds = ['66d9dfc96a7d2054230b809b'];
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

/**
 * Script Name: Convert Score to Retake Score
 * Description: This script converts the score of an evaluation to the score of a retake.
 * Usage: Execute this script to convert the score of an evaluation to the score of a retake.
 */

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

async function* getDeployments() {
  const deploymentsCount = await database
    .collection('package-manager_deployments')
    .countDocuments();

  yield deploymentsCount;

  const size = 10;
  const pages = Math.ceil(deploymentsCount / size);

  for (let page = 0; page < pages; page++) {
    const deployments = await database
      .collection('package-manager_deployments')
      .find({}, { projection: { id: 1 } })
      .skip(page * size)
      .limit(size)
      .toArray();

    for (let i = 0; i < deployments.length; i++) {
      yield deployments[i].id;
    }
  }
}

async function getPublishedScores(deploymentId) {
  return await database
    .collection('v1::scores_scores')
    .find({ deploymentID: deploymentId, published: true })
    .toArray();
}

async function getUnpublishedScores(deploymentId) {
  return await database
    .collection('v1::scores_scores')
    .find({ deploymentID: deploymentId, published: false })
    .toArray();
}

function convertScoreToRetakeScore({ gradedAt, student, published, ...score }) {
  return {
    ...score,
    id: score.id.replace('Scores', 'RetakeScores'),
    retakeId: null,
    retakeIndex: 0,
    user: student,
  };
}

function saveRetakeScores(retakeScores) {
  return database.collection('v1::scores_retakescores').insertMany(retakeScores);
}

function removeScores(scoreIds) {
  return database.collection('v1::scores_scores').deleteMany({ id: { $in: scoreIds } });
}

async function main() {
  try {
    await init();

    const deploymentGetter = getDeployments();
    let i = 1;

    const { value: deploymentsCount } = await deploymentGetter.next();

    for await (const deploymentId of deploymentGetter) {
      const unpublishedScores = await getUnpublishedScores(deploymentId);
      const publishedScores = await getPublishedScores(deploymentId);

      const retakeScores = unpublishedScores.map(convertScoreToRetakeScore);
      const publishedRetakeScores = publishedScores.map(convertScoreToRetakeScore);

      if (retakeScores.length > 0) {
        await saveRetakeScores(retakeScores);
        await removeScores(unpublishedScores.map(({ id }) => id));
      }

      if (publishedRetakeScores.length > 0) {
        await saveRetakeScores(publishedRetakeScores);
      }

      if (unpublishedScores.length === 0 && publishedScores.length === 0) {
        console.log(`No scores to convert for deployment ${i++}/${deploymentsCount}`);
      } else {
        console.log(`Converted score of deployment ${i++}/${deploymentsCount}`);
      }
    }
  } catch (error) {
    console.error('Error:', error);

    throw error;
  } finally {
    await client.close();
  }
}

main();

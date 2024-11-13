/**
 * Script Name: Test Questions Stem Resource
 * Description: This script transforms the questionImage property into a more flexible multimedea stemResource property.
 * The functionality purpose is to be able to associate a mulimedia asset to the stem of a question, currently questionImage
 * specifically was used for images, as a "cover" for the question.
 * Usage: Run this script to migrate the data (assetid) in questionImage to new property stemResource, and eliminate the questionImage property.
 */

const { MongoClient } = require('mongodb');

const MONGO_URI = process.env.MONGO_URI;

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
// FUNCTIONS

async function processQuestions() {
  const questionsCollection = database.collection('v1::tests_questions');
  const questionsWithQuestionImage = await questionsCollection
    .find({ questionImage: { $exists: true } })
    .toArray();

  if (questionsWithQuestionImage.length === 0) {
    console.log('✨ No questions with question image to update found.');
    return;
  }

  console.log(` 🔄 Updating ${questionsWithQuestionImage.length} questions...`);
  const updates = questionsWithQuestionImage.map((question) => ({
    updateOne: {
      filter: { id: question.id },
      update: {
        $set: { stemResource: question.questionImage },
        $unset: { questionImage: '' },
      },
    },
  }));

  const result = await questionsCollection.bulkWrite(updates);
  console.log(`Update results:`);
  console.log(`- Matched documents: ${result.matchedCount}`);
  console.log(`- Modified documents: ${result.modifiedCount}`);

  return result;
}

// ····································································································
// MAIN

(async () => {
  try {
    await init();
    await processQuestions();
    await client.close();
  } catch (error) {
    console.error('ERROR', error);
    await client.close();
  }
})();

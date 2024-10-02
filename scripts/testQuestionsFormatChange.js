/**
 * Script Name: Test Questions Format Change
 * Description: This script updates in DB the format of test questions
 *              from an old format to a new format called 'LeemonsQuestion'. It handles different
 *              types of questions including those with images and maps. The script ensures that
 *              all questions are updated to the new format to maintain consistency and functionality
 *              in the application.
 * Usage: Run this script to convert all existing test questions in the database to the new standardized format.
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

const processChoices = (value, withImages, properties) => {
  const { response, image, imageDescription, explanation, isCorrectResponse, hideOnHelp } = value;
  const choice = {
    isCorrect: isCorrectResponse,
    weight: null,
  };

  if (!withImages) {
    choice.text = {
      format: 'plain',
      text: response,
    };
  } else {
    choice.image = image;
    choice.imageDescription = imageDescription;
  }

  choice.feedback = null;
  if (explanation) {
    choice.feedback = {
      format: 'plain',
      text: explanation,
    };
  }

  if (properties.hasClues) {
    choice.hideOnHelp = !!hideOnHelp;
  }

  return choice;
};

function normalizeOldQuestions({
  type: questionType,
  question,
  properties,
  withImages,
  clues,
  tags: questionTags,
  id,
  category,
  level,
  questionImage,
}) {
  const parsedProperties = JSON.parse(properties);
  const parsedClues = JSON.parse(clues ?? '[]');

  const tags = questionTags?.length || null; // Supported but not currently in use
  const stem = {
    format: 'html',
    text: question,
  };
  const hasEmbeddedAnswers = false; // Not implemented currently
  const globalFeedback = parsedProperties.explanation
    ? {
        format: 'html',
        text: parsedProperties.explanation,
      }
    : null;

  let choices = null;
  let mapProperties = null;

  if (questionType === 'map') {
    mapProperties = {
      image: parsedProperties.image,
      caption: parsedProperties.caption,
      markers: {
        backgroundColor: parsedProperties.markers.backgroundColor,
        type: parsedProperties.markers.type,
        position: parsedProperties.markers.position,
        list: parsedProperties.markers.list.map((marker) => ({
          response: marker.response,
          hideOnHelp: marker.hideOnHelp,
          left: marker.left,
          top: marker.top,
        })),
      },
    };
  } else {
    choices = parsedProperties.responses.map((response) =>
      processChoices(response.value, withImages, parsedProperties)
    );
  }

  const finalObject = {
    id,
    tags,
    type: questionType,
    stem,
    hasEmbeddedAnswers,
    hasImageAnswers: !!withImages,
    globalFeedback,
    clues: parsedClues.map(({ value }) => value),
    category,
    level,
  };

  if (choices) {
    finalObject.choices = choices;
    finalObject.hasHelp = parsedClues?.length > 0 || choices.some((item) => item.hideOnHelp);
    finalObject.hasAnswerFeedback = choices.every((item) => item.feedback?.text);
  }

  if (mapProperties) {
    finalObject.mapProperties = mapProperties;
    finalObject.hasHelp =
      parsedClues?.length > 0 || mapProperties.markers.list.some((item) => item.hideOnHelp);
    finalObject.hasAnswerFeedback = false;
  }

  if (questionImage) {
    finalObject.questionImage = questionImage;
  }

  return finalObject;
}

async function normalizeToNewFormat() {
  const testQuestionsCollection = database.collection('v1::tests_questions');
  const questions = await testQuestionsCollection.find({}).toArray();

  if (questions.length === 0) {
    console.log('✨ No questions to update found.');
    return;
  }

  console.log('🔄 Updating questions...');
  const updates = questions.map((question) => ({
    updateOne: {
      filter: { id: question.id },
      update: {
        $set: normalizeOldQuestions(question),
        $unset: { properties: '', withImages: '', question: '' },
      },
    },
  }));

  const result = await testQuestionsCollection.bulkWrite(updates);
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
    await normalizeToNewFormat();
    await client.close();
  } catch (error) {
    console.error('ERROR', error);
    await client.close();
  }
})();

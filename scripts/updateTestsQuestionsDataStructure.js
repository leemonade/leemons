const { MongoClient } = require('mongodb');

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let database;

async function init() {
  await client.connect();
  database = client.db();
}

const QUESTION_TYPES = {
  MONO_RESPONSE: 'mono-response',
  MAP: 'map',
};

async function getQuestions() {
  const questionsCollection = database.collection('v1::tests_questions');
  return questionsCollection
    .find({
      properties: {
        $type: 'string',
        $regex: /^{.*}$/,
      },
    })
    .toArray();
}

function prepareUpdatedQuestion(question) {
  const properties = JSON.parse(question.properties || '{}');
  const clues = JSON.parse(question.clues || '[]');

  const updatedQuestion = {
    ...question,
    stem: { format: 'html', text: question.question },
    hasHelp: !!properties.hasClues,
    clues: clues.map((clue) => clue.value).filter(Boolean),
    hasEmbeddedAnswers: false,
    hasAnswerFeedback: !!properties.explanationInResponses,
    globalFeedback: properties.explanation
      ? { format: 'html', text: properties.explanation }
      : null,
    hasImageAnswers: !!question.withImages,
  };

  if (question.type === QUESTION_TYPES.MAP) {
    updatedQuestion.mapProperties = {
      caption: properties.caption,
      image: properties.image,
      markers: {
        position: properties.markers?.position,
        backgroundColor: properties.markers?.backgroundColor,
        type: properties.markers?.type,
        list: properties.markers?.list,
      },
    };
  } else if (question.type === QUESTION_TYPES.MONO_RESPONSE) {
    updatedQuestion.choices = (properties.responses || []).map((response) => ({
      text: response.value.response ? { format: 'html', text: response.value.response } : null,
      image: response.value.image || null,
      imageDescription: response.value.imageDescription || null,
      feedback: response.value.explanation
        ? { format: 'html', text: response.value.explanation }
        : null,
      isCorrect: response.value.isCorrectResponse,
      hideOnHelp: response.value.hideOnHelp,
    }));
  }

  // Remove old fields
  delete updatedQuestion.withImages;
  delete updatedQuestion.question;
  delete updatedQuestion.properties;

  return updatedQuestion;
}

async function updateQuestions(questions) {
  const questionsCollection = database.collection('v1::tests_questions');
  const bulkOps = questions.map((question) => {
    const updatedQuestion = prepareUpdatedQuestion(question);
    return {
      updateOne: {
        filter: { id: question.id },
        update: {
          $set: updatedQuestion,
          $unset: {
            question: '',
            properties: '',
            withImages: '',
          },
        },
      },
    };
  });

  try {
    const result = await questionsCollection.bulkWrite(bulkOps);
    return {
      success: true,
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
      upsertedCount: result.upsertedCount,
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

(async () => {
  try {
    await init();
    const questionsToUpdate = await getQuestions();
    console.log(`${questionsToUpdate.length} questions to update`);

    const updateResult = await updateQuestions(questionsToUpdate);

    if (updateResult.success) {
      console.log('Update Results:');
      console.log(`Total questions: ${questionsToUpdate.length}`);
      console.log(`Matched count: ${updateResult.matchedCount}`);
      console.log(`Modified count: ${updateResult.modifiedCount}`);
      console.log(`Upserted count: ${updateResult.upsertedCount}`);
    } else {
      console.error('Bulk update failed:', updateResult.error);
    }

    console.log(
      '✨✨✨ Bulk update completed. --------------------------------------------------------------------------'
    );

    await client.close();
  } catch (error) {
    console.error('Error during update process:', error);
    await client.close();
  }
})();

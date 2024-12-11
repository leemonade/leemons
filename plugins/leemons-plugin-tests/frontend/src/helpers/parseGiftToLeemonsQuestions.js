import { parse } from 'gift-pegjs';

import { QUESTION_TYPES } from '@tests/pages/private/questions-banks/questionConstants';

function parseGiftToLeemonsQuestions(giftQuestions) {
  const parsed = parse(giftQuestions);
  const questions = parsed ?? [];

  return questions
    .map((q) => {
      const { type, ...question } = q;

      const categoryValue = question.tags?.[0]; // Only one category supported currently
      if (categoryValue) {
        question.category = [{ value: categoryValue }];
      }

      const choices = question.choices?.map((choice) => ({
        isCorrect: choice.isCorrect,
        text: choice.text
          ? {
              format: choice.text.format === 'moodle' ? 'html' : choice.text.format,
              text: choice.text.text,
            }
          : undefined,
        feedback: choice.feedback
          ? {
              format: choice.feedback.format === 'moodle' ? 'html' : choice.feedback.format,
              text: choice.feedback.text,
            }
          : null,
        hideOnHelp: undefined,
        image: undefined,
        imageDescription: undefined,
      }));

      if (choices) {
        question.choices = choices;
      }

      const globalFeedback = question.globalFeedback
        ? {
            format: 'html',
            text: question.globalFeedback.text,
          }
        : null;

      const hasAnswerFeedback = Boolean(choices?.every((choice) => choice.feedback !== null));

      switch (type) {
        case 'MC': {
          const correctAnswers = choices?.filter((c) => c.isCorrect);
          question.type =
            correctAnswers?.length === 1
              ? QUESTION_TYPES.MONO_RESPONSE
              : QUESTION_TYPES.MULTI_RESPONSE;
          break;
        }
        case 'TF': {
          question.type = QUESTION_TYPES.TRUE_FALSE;
          const { incorrectFeedback, correctFeedback, isTrue } = question;
          const trueFalseProperties = {
            isTrue,
            correctFeedback,
            incorrectFeedback,
          };

          question.hasAnswerFeedback = !!incorrectFeedback || !!correctFeedback;
          question.trueFalseProperties = trueFalseProperties;

          if (question.hasAnswerFeedback) {
            question.globalFeedback = incorrectFeedback ?? correctFeedback;
          }

          delete question.incorrectFeedback;
          delete question.correctFeedback;
          delete question.isTrue;

          break;
        }
        case 'Short': {
          question.type = QUESTION_TYPES.SHORT_RESPONSE;
          question.choices?.forEach((choice, i) => {
            choice.text.format = 'plain';
            if (i === 0) {
              choice.isMainChoice = true;
            }
            if (choice.feedback && !question.globalFeedback) {
              question.globalFeedback = choice.feedback;
            }
          });
          break;
        }
        case 'Essay': {
          question.type = QUESTION_TYPES.OPEN_RESPONSE;
          question.openResponseProperties = {};
          break;
        }
      }

      delete question.id;
      delete question.title;

      if (question.globalFeedback) {
        question.hasAnswerFeedback = false;
      }

      return {
        ...question,
        stem: {
          format: 'html',
          text: question.stem.text,
        },
        hasEmbeddedAnswers: !!question.hasEmbeddedAnswers,
        hasImageAnswers: false,
        clues: [],
        hasHelp: false,
        questionImage: undefined,
        globalFeedback: question.globalFeedback ?? globalFeedback,
        hasAnswerFeedback: question.hasAnswerFeedback ?? hasAnswerFeedback,
      };
    })
    .filter((q) => Boolean(q.type));
}

export { parseGiftToLeemonsQuestions };

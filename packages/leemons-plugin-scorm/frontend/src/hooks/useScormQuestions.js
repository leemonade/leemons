import React from 'react';
import { toArray } from 'lodash';

export function useScormQuestions({ state, assignable }) {
  const interactions = toArray(state?.cmi?.interactions ?? {});
  const interactionsLength = interactions.length;
  const numberOfQuestions = assignable?.metadata?.numberOfAttempts ?? 0;

  return React.useMemo(() => {
    if (interactionsLength) {
      const attemptsUsed = numberOfQuestions
        ? Math.floor(interactionsLength / numberOfQuestions)
        : 1;

      const firstQuestion = (attemptsUsed - 1) * numberOfQuestions;
      const lastQuestion = firstQuestion + numberOfQuestions;

      const existingQuestions = interactions.slice(0, numberOfQuestions);
      const questionsAnswered = interactions.slice(firstQuestion, lastQuestion);

      return {
        questions: existingQuestions.map((question) => question?.title ?? question?.description),
        answers: questionsAnswered.map((question) => question.result === 'correct'),
      };
    }

    return {
      questions: [],
      answers: [],
    };
  }, [interactions, numberOfQuestions]);
}

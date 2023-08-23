import { useMemo } from 'react';
import { get, isEqual } from 'lodash';
import { unflatten } from '@common';
import { evaluationTypes } from '@assignables/components/Assignment/components/EvaluationType';
import useTranslateLoader from '@multilanguage/useTranslateLoader';

export function useEvaluationTypeLocalizations() {
  // key is array
  const key = 'plugins.assignables.assignmentForm.evaluation.typeInput.options';
  const [, translations] = useTranslateLoader(key);

  return useMemo(() => {
    if (translations && translations.items) {
      const res = unflatten(translations.items);

      return get(res, key);
    }

    return {};
  });
}

export function useEvaluationType(activity) {
  return useMemo(() => {
    if (!activity) {
      return null;
    }

    const typeValues = {
      requiresScoring: !!activity.requiresScoring,
      allowFeedback: !!activity.allowFeedback,
      gradable: !!activity.gradable,
    };

    const [type] = Object.entries(evaluationTypes).find(([, value]) => isEqual(typeValues, value));

    return type;
  }, [!!activity?.requiresScoring, !!activity.allowFeedback, !!activity.gradable]);
}

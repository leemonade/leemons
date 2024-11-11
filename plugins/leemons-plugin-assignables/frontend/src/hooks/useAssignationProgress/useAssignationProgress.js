import { useMemo } from 'react';

import { useTheme } from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import getNearestScale from '@scorm/helpers/getNearestScale';

import useProgramEvaluationSystem from '../useProgramEvaluationSystem';

import { COLORS, STATUS, STATUS_NAMES } from './constants';
import getSeverity from './helpers/getSeverity';
import getStatusName from './helpers/getStatusName';

import prefixPN from '@assignables/helpers/prefixPN';

/**
 * @typedef Instance
 * @property {{program: string, subject: string }} subjects
 * @property {boolean} requiresScoring
 * @property {boolean} allowFeedback
 * @property {Object} metadata
 * @property {{type: 'module' | 'activity'}} metadata.module
 *
 * @typedef Assignation
 * @property {Instance} instance
 * @property {Array<{type: 'main' | 'feedback', value: number}>} grades
 *
 * @param {Object} props
 * @param {Assignation} props.assignation
 * @param {boolean} props.isBlocked
 */
export default function useAssignationProgress({ assignation = {}, isBlocked }) {
  const [t] = useTranslateLoader(prefixPN('activity_status'));
  const theme = useTheme();

  const { instance } = assignation;
  const { requiresScoring, allowFeedback } = instance ?? {};
  const isModule = instance?.metadata?.module?.type === 'module';

  const subjectsCount = instance?.subjects?.length ?? 0;

  const isEvaluable = !isModule && (requiresScoring || allowFeedback);
  const mainGrades = useMemo(
    () => assignation?.grades?.filter(({ type }) => type === 'main') ?? [],
    [assignation]
  );
  const hasAllGrades = mainGrades?.length === subjectsCount && subjectsCount > 0;
  const hasBeenEvaluated = isEvaluable && hasAllGrades;

  const averageGrade =
    hasAllGrades && mainGrades?.length
      ? mainGrades?.reduce((acc, { grade }) => acc + grade, 0) / mainGrades?.length
      : null;

  const statusName = getStatusName({ assignation, isBlocked, isEvaluable, hasBeenEvaluated });
  const status = STATUS[statusName];

  const isEvaluated = statusName === STATUS_NAMES.evaluated;

  const evaluationSystem = useProgramEvaluationSystem(instance, { enabled: isEvaluated });
  const nearestScale = evaluationSystem
    ? getNearestScale({ grade: averageGrade, evaluationSystem })
    : null;
  const nearestScaleDisplay = nearestScale?.letter ?? nearestScale?.number ?? null;

  const color = status.color ?? getSeverity(instance);

  return {
    statusName,
    label: isEvaluated ? `${t(status.labelKey)} (${nearestScaleDisplay})` : t(status.labelKey),
    color,
    hexColor: COLORS(theme)[color],
  };
}

import { useEffect, useMemo } from 'react';

import { Alert, LoadingOverlay, Stack } from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import useStudentAssignationMutation from '@tasks/hooks/student/useStudentAssignationMutation';
import PropTypes from 'prop-types';

import EmptyState from './components/EmptyState';
import WeightTypeBadge from './components/WeightTypeBadge';
import handleOpen from './helpers/handleOpen';
import onDataChange from './helpers/onDataChange';
import useTableData from './hooks/useTableData';

import { ScoresBasicTable } from '@scores/components/Tables/ScoresBasicTable';
import { prefixPN } from '@scores/helpers';
import { useScoresMutation } from '@scores/requests/hooks/mutations';
import { useSetManualActivityScoresMutation } from '@scores/requests/hooks/mutations/useSetManualActivityScoresMutation';
import useEvaluationNotebookStore from '@scores/stores/evaluationNotebookStore';

export default function ScoresTable({ program, class: klass, period, filters }) {
  const [t] = useTranslateLoader(prefixPN('evaluationNotebook'));
  const labels = {
    students: t('scoresTable.students'),
    noActivity: t('scoresTable.noActivity'),
    submitted: t('scoresTable.submitted'),
    avgScore: t('scoresTable.avgScore'),
    gradingTasks: t('scoresTable.calculated'),
    customScore: t('scoresTable.custom'),
    attendance: t('scoresTable.attendance'),

    unableToOpen: t('unableToOpen'),
    noEvaluationPage: t('noEvaluationPage'),
    updatedSuccess: t('updatedSuccess'),
    updatedError: t('updatedError'),
  };

  const setTableData = useEvaluationNotebookStore((state) => state.setTableData);
  const { mutateAsync: assignationScoreMutate } = useStudentAssignationMutation();
  const { mutateAsync: customScoreMutate } = useScoresMutation();
  const { mutateAsync: manualActivityScoreMutate } = useSetManualActivityScoresMutation();

  const { scales, usePercentage, activities, studentsData, isLoading } = useTableData({
    program,
    class: klass,
    period,
    filters,
  });

  const isPeriodClosed = useMemo(
    () => studentsData?.every((student) => !student.allowCustomChange),
    [studentsData]
  );

  useEffect(() => {
    setTableData({
      activitiesData: { activities, value: studentsData },
      grades: scales,
      filters: { startDate: period?.startDate, endDate: period?.endDate, period },
      programData: program,
      subjectData: klass?.subject,
      class: klass,
    });
  }, [activities, studentsData, scales, period, program, klass, setTableData]);

  if (isLoading) {
    return <LoadingOverlay visible />;
  }

  if (!studentsData?.length || !activities?.length) {
    return <EmptyState />;
  }

  return (
    <Stack direction="column" spacing={4}>
      {activities?.some((activity) => activity.hasNoWeight) && (
        <Alert severity="warning" closeable={false}>
          {t('newModule')}
        </Alert>
      )}
      <ScoresBasicTable
        grades={scales}
        usePercentage={usePercentage}
        activities={activities}
        value={studentsData}
        periodName={period?.period?.name}
        from={period?.startDate}
        to={period?.endDate}
        labels={labels}
        onOpen={({ rowId, columnId }) => handleOpen({ rowId, columnId, activities, labels })}
        onDataChange={onDataChange({
          assignationScoreMutate,
          customScoreMutate,
          manualActivityScoreMutate,
          scales,
          students: studentsData,
          activities,
          class: klass,
          period,
          labels,
        })}
        key={studentsData}
        leftBadge={<WeightTypeBadge class={klass} includePlaceholder />}
        hideCustom={!!filters?.period?.isCustom}
        viewOnly={isPeriodClosed}
      />
    </Stack>
  );
}

ScoresTable.propTypes = {
  program: PropTypes.string.isRequired,
  class: PropTypes.object.isRequired,
  period: PropTypes.shape({
    startDate: PropTypes.string.isRequired,
    endDate: PropTypes.string.isRequired,
    period: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  filters: PropTypes.object.isRequired,
};

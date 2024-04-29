import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { Alert, LoadingOverlay, Stack } from '@bubbles-ui/components';

import { ScoresBasicTable } from '@scores/components/Tables/ScoresBasicTable';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { prefixPN } from '@scores/helpers';
import useStudentAssignationMutation from '@tasks/hooks/student/useStudentAssignationMutation';
import { useScoresMutation } from '@scores/requests/hooks/mutations';
import useEvaluationNotebookStore from '@scores/stores/evaluationNotebookStore';
import useTableData from './hooks/useTableData';
import WeightTypeBadge from './components/WeightTypeBadge';
import handleOpen from './helpers/handleOpen';
import onDataChange from './helpers/onDataChange';
import EmptyState from './components/EmptyState';

export default function ScoresTable({ program, class: klass, period, filters }) {
  const [t] = useTranslateLoader(prefixPN('evaluationNotebook'));
  const labels = {
    students: t('scoresTable.students'),
    noActivity: t('scoresTable.noActivity'),
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

  const { scales, activities, studentsData, isLoading } = useTableData({
    program,
    class: klass,
    period,
    filters,
  });

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
          scales,
          students: studentsData,
          activities,
          class: klass,
          period,
          labels,
        })}
        key={studentsData}
        leftBadge={<WeightTypeBadge class={klass} includePlaceholder />}
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

import { ContextContainer, LoadingOverlay } from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';

import {
  printErrorMessage,
  printSuccessMessage,
} from '../EvaluationNotebook/ScoresTable/helpers/printMessages';
import useScoresTableTitle from '../EvaluationNotebook/hooks/useScoresTableTitle';
import { ScoresBasicTable } from '../Tables/ScoresBasicTable';

import Filters from './components/Filters';
import useTableData from './hooks/useTableData';

import { prefixPN } from '@scores/helpers';
import { useScoresMutation } from '@scores/requests/hooks/mutations';
import useEvaluationNotebookStore from '@scores/stores/evaluationNotebookStore';

function useOnDataChange({ classId, students, scales }) {
  const { mutateAsync: updateScore } = useScoresMutation();

  const [t] = useTranslateLoader(prefixPN('evaluationNotebook'));

  const labels = {
    updatedSuccess: t('updatedSuccess'),
    updatedError: t('updatedError'),
  };

  return ({ rowId: studentId, value: score }) => {
    const grade = scales.find((g) => g.number === parseInt(score, 10) || g.letter === score);

    const student = students.find((s) => s.id === studentId);

    return updateScore({
      scores: [
        {
          student: studentId,
          class: classId,
          period: 'final',
          published: true,
          grade: parseInt(score, 10),
        },
      ],
    })
      .then(() =>
        printSuccessMessage({
          labels,
          student,
          activity: t('final'),
          score: grade,
        })
      )
      .catch((e) =>
        printErrorMessage({
          labels,
          student,
          activity: t('final'),
          score: grade,
          error: e,
        })
      );
  };
}

export default function FinalEvaluationNotebook() {
  const filters = useEvaluationNotebookStore((store) => store.filters);
  const setFilters = useEvaluationNotebookStore((store) => store.setFilters);
  const { period, class: klass, program } = filters;

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

  const title = useScoresTableTitle(filters);

  const { activities, students, scales, usePercentage, isLoading } = useTableData({
    class: klass,
    program,
    filters,
  });

  const onDataChange = useOnDataChange({ classId: klass.id, students, scales });

  if (isLoading) {
    return <LoadingOverlay visible />;
  }

  return (
    <ContextContainer title={title}>
      <Filters onChange={setFilters} value={filters} />
      <ScoresBasicTable
        grades={scales}
        usePercentage={usePercentage}
        activities={activities}
        value={students}
        periodName={period?.period?.name}
        from={period?.startDate}
        to={period?.endDate}
        labels={labels}
        key={students}
        onDataChange={onDataChange}
      />
    </ContextContainer>
  );
}

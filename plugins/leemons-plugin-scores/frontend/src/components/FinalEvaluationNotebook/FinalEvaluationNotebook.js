import { ContextContainer, LoadingOverlay } from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import PropTypes from 'prop-types';

import useScoresTableTitle from '../EvaluationNotebook/hooks/useScoresTableTitle';
import { ScoresBasicTable } from '../Tables/ScoresBasicTable';

import Filters from './components/Filters';
import useTableData from './hooks/useTableData';

import { prefixPN } from '@scores/helpers';
import useEvaluationNotebookStore from '@scores/stores/evaluationNotebookStore';

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
      />
    </ContextContainer>
  );
}

FinalEvaluationNotebook.propTypes = {
  filters: PropTypes.shape({
    class: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }),
    program: PropTypes.string.isRequired,
    period: PropTypes.shape({
      id: PropTypes.string.isRequired,
      period: PropTypes.shape({
        name: PropTypes.string.isRequired,
      }).isRequired,
      startDate: PropTypes.string.isRequired,
      endDate: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

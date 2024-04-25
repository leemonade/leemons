import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { ContextContainer, LoadingOverlay } from '@bubbles-ui/components';

import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { prefixPN } from '@scores/helpers';
import { ScoresBasicTable } from '../Tables/ScoresBasicTable';
import useScoresTableTitle from '../EvaluationNotebook/hooks/useScoresTableTitle';
import useTableData from './hooks/useTableData';
import Filters from './components/Filters';

export default function FinalEvaluationNotebook({ filters }) {
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
  const [localFilters, setFilters] = useState({});

  const { activities, students, scales, isLoading } = useTableData({
    class: klass,
    program,
    filters: localFilters,
  });

  if (isLoading) {
    return <LoadingOverlay visible />;
  }

  return (
    <ContextContainer title={title}>
      <Filters onChange={setFilters} />
      <ScoresBasicTable
        grades={scales}
        activities={activities}
        value={students}
        periodName={period?.period?.name}
        from={period?.startDate}
        to={period?.endDate}
        labels={labels}
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

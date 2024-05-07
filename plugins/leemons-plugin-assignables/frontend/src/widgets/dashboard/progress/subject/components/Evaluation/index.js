import React, { useState } from 'react';

import { ContextContainer, LoadingOverlay, Paper } from '@bubbles-ui/components';
import useWeights from '@scores/requests/hooks/queries/useWeights';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@assignables/helpers/prefixPN';
import HeaderWithFilter from './components/HeaderWithFilters';
import ProgressTable from './components/ProgressTable';

export default function EvaluationProgress({ class: classroom }) {
  const [t] = useTranslateLoader(prefixPN('evaluationTable'));
  const [filters, setFilers] = useState({});

  const { data: weights, isLoading } = useWeights({ classId: classroom.id });

  if (isLoading) {
    return <LoadingOverlay visible />;
  }

  return (
    <Paper>
      <ContextContainer title={t('title')}>
        <HeaderWithFilter onChange={setFilers} weights={weights} />
        <ProgressTable filters={filters} class={classroom} weights={weights} />
      </ContextContainer>
    </Paper>
  );
}

import React from 'react';

import { ContextContainer } from '@bubbles-ui/components';

import useEvaluationNotebookStore from '@scores/stores/evaluationNotebookStore';
import { NotebookFilters } from './components/NotebookFilters';
import { ScoresTable } from './ScoresTable';
import useScoresTableTitle from './hooks/useScoresTableTitle';

export default function EvaluationNotebook() {
  const filters = useEvaluationNotebookStore((state) => state.filters);
  const setFilters = useEvaluationNotebookStore((state) => state.setFilters);

  const title = useScoresTableTitle(filters);

  return (
    <ContextContainer title={title}>
      <NotebookFilters filters={filters} onChange={setFilters} value={filters} />
      <ScoresTable
        filters={filters}
        program={filters.program}
        class={filters?.class}
        period={filters?.period}
      />
    </ContextContainer>
  );
}

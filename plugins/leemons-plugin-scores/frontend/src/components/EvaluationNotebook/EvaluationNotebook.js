import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { ContextContainer } from '@bubbles-ui/components';

import { NotebookFilters } from './components/NotebookFilters';
import { ScoresTable } from './ScoresTable';
import useScoresTableTitle from './hooks/useScoresTableTitle';

export default function EvaluationNotebook({ filters }) {
  const title = useScoresTableTitle(filters);
  const [notebookFilters, setNotebookFilters] = useState(filters);

  return (
    <ContextContainer title={title}>
      <NotebookFilters filters={filters} onChange={setNotebookFilters} />
      <ScoresTable
        filters={notebookFilters}
        program={filters.program}
        class={filters?.class}
        period={filters?.period}
      />
    </ContextContainer>
  );
}

EvaluationNotebook.propTypes = {
  filters: PropTypes.shape({
    program: PropTypes.string.isRequired,
    class: PropTypes.string.isRequired,
    period: PropTypes.string.isRequired,
  }).isRequired,
};

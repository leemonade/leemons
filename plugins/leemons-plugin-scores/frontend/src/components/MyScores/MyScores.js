import React from 'react';

import { ContextContainer } from '@bubbles-ui/components';

import useMyScoresStore from '@scores/stores/myScoresStore';
import useMyScoresViewTitle from './hooks/useMyScoresViewTitle';
import MyScoresFilters from './components/MyScoresFilters/MyScoresFilters';
import SubjectsScoreList from './components/SubjectsScoreList/SubjectsScoreList';

export default function MyScores() {
  const filters = useMyScoresStore((state) => state.filters);
  const setFilters = useMyScoresStore((state) => state.setFilters);

  const title = useMyScoresViewTitle(filters);

  return (
    <ContextContainer title={title}>
      <MyScoresFilters filters={filters} onChange={setFilters} value={filters} />
      <SubjectsScoreList {...filters} />
    </ContextContainer>
  );
}

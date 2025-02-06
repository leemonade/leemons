import { ContextContainer } from '@bubbles-ui/components';

import MyScoresFilters from '../MyScores/components/MyScoresFilters/MyScoresFilters';

import { SubjectsScoreList } from './components/SubjectsScoreList';

import useMyScoresViewTitle from '@scores/components/MyScores/hooks/useMyScoresViewTitle';
import useMyScoresStore from '@scores/stores/myScoresStore';

export function MyFinalScores() {
  const filters = useMyScoresStore((state) => state.filters);
  const setFilters = useMyScoresStore((state) => state.setFilters);

  const title = useMyScoresViewTitle(filters);

  return (
    <ContextContainer title={title}>
      <MyScoresFilters
        filters={filters}
        onChange={setFilters}
        value={filters}
        hideActivitySearch
        hideSeeNonEvaluable
      />
      <SubjectsScoreList filters={filters} />
    </ContextContainer>
  );
}

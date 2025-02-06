import { useEffect } from 'react';

import { Box, ContextContainer, Stack, Text, TLayout } from '@bubbles-ui/components';
import { EvaluatedIcon } from '@learning-paths/components/ModuleDashboard/components/DashboardCard/components/EvaluationStateDisplay/icons/EvaluatedIcon';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { MyFinalScores } from '@scores/components/MyFinalScores';

import MyScores from '@scores/components/MyScores/MyScores';
import Filters from '@scores/components/MyScores/components/Filters/Filters';
import Footer from '@scores/components/MyScores/components/PageFooter/PageFooter';
import { prefixPN } from '@scores/helpers';
import useMyScoresStore from '@scores/stores/myScoresStore';

function EmptyState() {
  const [t] = useTranslateLoader(prefixPN('myScores.emptyStates.noFilters'));
  return (
    <Stack justifyContent="center" alignItems="center" fullWidth fullHeight>
      <Box sx={{ maxWidth: 400 }}>
        <ContextContainer title={t('title')}>
          <Text>{t('description')}</Text>
        </ContextContainer>
      </Box>
    </Stack>
  );
}

export default function MyScoresPage() {
  const [t] = useTranslateLoader(prefixPN('myScores'));

  const filters = useMyScoresStore((state) => state.filters);
  const setFilters = useMyScoresStore((state) => state.setFilters);
  const reset = useMyScoresStore((state) => state.reset);
  const hasData = !!useMyScoresStore((state) => state.columns.size);

  useEffect(() => reset, [reset]);

  return (
    <TLayout>
      <TLayout.Header
        title={t('title')}
        icon={<EvaluatedIcon width={24} height={24} color="#000" />}
        cancelable={false}
      >
        <Filters onChange={setFilters} value={filters} />
      </TLayout.Header>
      <TLayout.Content>
        {!filters && <EmptyState />}
        {filters && filters?.period?.id === 'final' && <MyFinalScores />}
        {filters && filters?.period?.id !== 'final' && <MyScores />}
      </TLayout.Content>
      {hasData && (
        <TLayout.Footer>
          <TLayout.Footer.RightActions>
            <Footer period={filters?.period?.id} />
          </TLayout.Footer.RightActions>
        </TLayout.Footer>
      )}
    </TLayout>
  );
}

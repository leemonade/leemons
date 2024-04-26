import React, { useState } from 'react';

import { Box, ContextContainer, Stack, Text, TLayout } from '@bubbles-ui/components';

import { EvaluatedIcon } from '@learning-paths/components/ModuleDashboard/components/DashboardCard/components/EvaluationStateDisplay/icons/EvaluatedIcon';
import Filters from '@scores/components/MyScores/components/Filters/Filters';
import MyScores from '@scores/components/MyScores/MyScores';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { prefixPN } from '@scores/helpers';

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
  const [filters, setFilters] = useState(null);

  return (
    <TLayout>
      <TLayout.Header
        title={t('title')}
        icon={<EvaluatedIcon width={24} height={24} color="#000" />}
        cancelable={false}
      >
        <Filters onChange={setFilters} />
      </TLayout.Header>
      <TLayout.Content>{filters ? <MyScores filters={filters} /> : <EmptyState />}</TLayout.Content>
    </TLayout>
  );
}

import { useEffect } from 'react';

import { Box, ContextContainer, Stack, Text, TLayout } from '@bubbles-ui/components';
import { EvaluatedIcon } from '@learning-paths/components/ModuleDashboard/components/DashboardCard/components/EvaluationStateDisplay/icons/EvaluatedIcon';
import useTranslateLoader from '@multilanguage/useTranslateLoader';

import EvaluationNotebook from '@scores/components/EvaluationNotebook/EvaluationNotebook';
import PageFooter from '@scores/components/EvaluationNotebook/components/PageFooter/PageFooter';
import FinalEvaluationNotebook from '@scores/components/FinalEvaluationNotebook/FinalEvaluationNotebook';
import Filters from '@scores/components/__DEPRECATED__/ScoresPage/Filters/Filters';
import { prefixPN } from '@scores/helpers';
import useEvaluationNotebookStore from '@scores/stores/evaluationNotebookStore';

function EmptyState() {
  const [t] = useTranslateLoader(prefixPN('evaluationNotebook.emptyState.noFilters'));
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

export default function EvaluationNotebookPage() {
  const [t] = useTranslateLoader(prefixPN('evaluationNotebook'));

  const filters = useEvaluationNotebookStore((state) => state.filters);
  const setFilters = useEvaluationNotebookStore((state) => state.setFilters);
  const resetStore = useEvaluationNotebookStore((state) => state.reset);

  useEffect(() => resetStore, [resetStore]);

  return (
    <TLayout>
      <TLayout.Header
        title={t('title')}
        icon={<EvaluatedIcon width={24} height={24} color="#000" />}
        cancelable={false}
      >
        <Filters hideTitle showProgramSelect onChange={setFilters} value={filters} />
      </TLayout.Header>
      <TLayout.Content fullWidth>
        {!filters && <EmptyState />}
        {filters && filters?.period?.selected !== 'final' && <EvaluationNotebook />}
        {filters && filters?.period?.selected === 'final' && (
          <FinalEvaluationNotebook filters={filters} />
        )}
      </TLayout.Content>
      {filters?.period?.selected !== 'final' && (
        <TLayout.Footer fullWidth>
          <TLayout.Footer.RightActions>
            <PageFooter isCustom={!!filters?.period?.isCustom} />
          </TLayout.Footer.RightActions>
        </TLayout.Footer>
      )}
    </TLayout>
  );
}

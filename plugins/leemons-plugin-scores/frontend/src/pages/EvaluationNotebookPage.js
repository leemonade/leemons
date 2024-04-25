import React, { useState } from 'react';

import { Box, Button, ContextContainer, Stack, Text, TLayout } from '@bubbles-ui/components';
import { DownloadIcon } from '@bubbles-ui/icons/outline';
import { addAction, fireEvent, removeAction } from 'leemons-hooks';

import { EvaluatedIcon } from '@learning-paths/components/ModuleDashboard/components/DashboardCard/components/EvaluationStateDisplay/icons/EvaluatedIcon';
import Filters from '@scores/components/ScoresPage/Filters/Filters';
import EvaluationNotebook from '@scores/components/EvaluationNotebook/EvaluationNotebook';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { prefixPN } from '@scores/helpers';
import { addErrorAlert } from '@layout/alert';
import FinalEvaluationNotebook from '@scores/components/FinalEvaluationNotebook/FinalEvaluationNotebook';

function onScoresDownload(extension) {
  let timer;
  const downloadScoresError = 'scores::download-scores-error';
  const onClearTimer = () => {
    clearTimeout(timer);

    removeAction('scores::downloaded-intercepted', onClearTimer);
  };

  const onError = ({ args: [e] }) => {
    addErrorAlert(`Error downloading scores report ${e.message}`);

    removeAction(downloadScoresError, onError);
  };

  addAction('scores::downloaded-intercepted', onClearTimer);
  addAction(downloadScoresError, onError);

  fireEvent('scores::download-scores', extension);
  timer = setTimeout(() => {
    fireEvent(downloadScoresError, new Error('timeout'));
  }, 1000);
}

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
  const [filters, setFilters] = useState(null);

  return (
    <TLayout>
      <TLayout.Header
        title={t('title')}
        icon={<EvaluatedIcon width={24} height={24} color="#000" />}
        cancelable={false}
      >
        <Filters hideTitle showProgramSelect onChange={setFilters} />
      </TLayout.Header>
      <TLayout.Content>
        {!filters && <EmptyState />}
        {filters && filters?.period?.selected === 'final' && (
          <FinalEvaluationNotebook filters={filters} />
        )}
        {filters && filters?.period?.selected !== 'final' && (
          <EvaluationNotebook filters={filters} />
        )}
      </TLayout.Content>
      <TLayout.Footer>
        <TLayout.Footer.RightActions>
          <Button
            variant="outline"
            onClick={() => onScoresDownload('xlsx')}
            leftIcon={<DownloadIcon />}
          >
            Excel
          </Button>
          <Button
            variant="outline"
            onClick={() => onScoresDownload('csv')}
            leftIcon={<DownloadIcon />}
          >
            CSV
          </Button>
        </TLayout.Footer.RightActions>
      </TLayout.Footer>
    </TLayout>
  );
}

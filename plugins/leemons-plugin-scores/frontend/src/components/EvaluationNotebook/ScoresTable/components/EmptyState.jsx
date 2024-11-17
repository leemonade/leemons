import React from 'react';

import { Box, ContextContainer, Stack, Text } from '@bubbles-ui/components';

import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { prefixPN } from '@scores/helpers';

export default function EmptyState() {
  const [t] = useTranslateLoader(prefixPN('evaluationNotebook.emptyState.noResults'));
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

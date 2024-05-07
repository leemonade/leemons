import React from 'react';

import { ContextContainer, Stack, Title } from '@bubbles-ui/components';

import { useIsStudent } from '@academic-portfolio/hooks';
import prefixPN from '@assignables/helpers/prefixPN';
import useWelcome from '@dashboard/request/hooks/queries/useWelcome';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import ProgressChartWidget from './subject/components/ProgressChart';

export default function Progress() {
  const [t] = useTranslateLoader(prefixPN('progress'));

  const { data: welcomeCompleted } = useWelcome();
  const isStudent = useIsStudent();

  if (!welcomeCompleted || isStudent === null) {
    return null;
  }

  return (
    <ContextContainer>
      <Stack alignItems="center" justifyContent="space-between">
        <Title order={2}>{t('tabTitle')}</Title>
      </Stack>
      <ProgressChartWidget />
    </ContextContainer>
  );
}

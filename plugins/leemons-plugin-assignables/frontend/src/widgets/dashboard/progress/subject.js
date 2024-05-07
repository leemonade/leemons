import React from 'react';
import PropTypes from 'prop-types';
import { Stack, Title, ContextContainer, Paper } from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@assignables/helpers/prefixPN';
import useWelcome from '@dashboard/request/hooks/queries/useWelcome';
import { useIsStudent } from '@academic-portfolio/hooks';
import ProgressChartWidget from './subject/components/ProgressChart';

export default function Progress({ classe }) {
  const { data: welcomeCompleted } = useWelcome();
  const [t] = useTranslateLoader(prefixPN('progress'));
  const isStudent = useIsStudent();

  if (!welcomeCompleted || isStudent === null) {
    return null;
  }

  return (
    <ContextContainer>
      <Stack alignItems="center" justifyContent="space-between">
        <Title order={2}>{t('tabTitle')}</Title>
      </Stack>
      <Paper shadow="none">
        <ProgressChartWidget classe={classe} />
      </Paper>
    </ContextContainer>
  );
}

Progress.propTypes = {
  classe: PropTypes.string.isRequired,
};

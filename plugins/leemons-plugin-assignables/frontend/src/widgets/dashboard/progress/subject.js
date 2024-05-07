import React from 'react';
import PropTypes from 'prop-types';
import { Stack, Title, ContextContainer, Paper } from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@assignables/helpers/prefixPN';
import useWelcome from '@dashboard/request/hooks/queries/useWelcome';
import { useIsStudent } from '@academic-portfolio/hooks';
import ProgressChartWidget from './subject/components/ProgressChart';
import EvaluationProgress from './subject/components/Evaluation';

export default function Progress({ classe }) {
  const { data: welcomeCompleted } = useWelcome();
  const [t] = useTranslateLoader(prefixPN('progress'));
  const isStudent = useIsStudent();

  if (!welcomeCompleted || isStudent === null) {
    return null;
  }

  const titleKey = `dashboardTitle.subject.${isStudent ? 'student' : 'teacher'}`;

  return (
    <ContextContainer>
      <Stack alignItems="center" justifyContent="space-between">
        <Title order={2}>{t(titleKey)}</Title>
      </Stack>
      <Paper shadow="none">
        <ProgressChartWidget classe={classe} roundValues />
      </Paper>
      {isStudent && <EvaluationProgress class={classe} />}
    </ContextContainer>
  );
}

Progress.propTypes = {
  classe: PropTypes.string.isRequired,
};

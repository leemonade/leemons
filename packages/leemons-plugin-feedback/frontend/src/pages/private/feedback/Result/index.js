import React from 'react';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@feedback/helpers/prefixPN';
import { useStore } from '@common';
import { useParams } from 'react-router-dom';
import { Box, Stack, Title } from '@bubbles-ui/components';
import { getFeedbackResultsRequest } from '@feedback/request';
import ResultStyles from './Result.styles';

export default function Result() {
  const [t] = useTranslateLoader(prefixPN('feedbackResult'));
  const [store, render] = useStore({
    loading: false,
    isNew: false,
    currentStep: 0,
    data: {
      metadata: {},
    },
  });

  const { classes } = ResultStyles({}, { name: 'Result' });

  const params = useParams();

  async function init() {
    const result = await getFeedbackResultsRequest(params.id);
    console.log('Results:', result);
  }

  React.useEffect(() => {
    if (params.id) init();
  }, [params.id]);

  return (
    <Stack justifyContent="center" fullWidth fullHeight className={classes.root}>
      <Stack direction="column" spacing={4} className={classes.container}>
        <Box className={classes.resultHeader}>
          <Title order={5} role="productive" color="quartiary">
            {t('feedback')}
          </Title>
          <Title order={3} style={{ marginTop: 2 }}>
            Satisfacción Máster UX Research
          </Title>
        </Box>
        <Box className={classes.resultHeader}></Box>
      </Stack>
    </Stack>
  );
}

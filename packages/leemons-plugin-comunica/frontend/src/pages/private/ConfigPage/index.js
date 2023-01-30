import React from 'react';
import { Box, ContextContainer, PageContainer, PageHeader, Paper } from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@comunica/helpers/prefixPN';
import { useStore } from '@common';
import { ConfigPageStyles } from '@comunica/pages/private/ConfigPage/index.styles';

export default function ConfigPage() {
  const [t] = useTranslateLoader(prefixPN('config'));
  const { classes } = ConfigPageStyles();
  const [store, render] = useStore();

  return (
    <ContextContainer fullHeight>
      <PageHeader
        values={{
          title: t('title'),
          description: t('description'),
        }}
        fullWidth
      />
      <Paper color="solid" shadow="none" padding="none">
        <PageContainer noFlex>
          <Box className={classes.subTitle}></Box>
        </PageContainer>
      </Paper>
    </ContextContainer>
  );
}

import React, { useMemo } from 'react';
import {
  Paper,
  Divider,
  Box,
  Stack,
  ImageLoader,
  Button,
  Checkbox,
  PageContainer,
  ContextContainer,
} from '@bubbles-ui/components';
import { AdminPageHeader } from '@bubbles-ui/leemons';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@academic-portfolio/helpers/prefixPN';
import { useAsync } from '@common/useAsync';
import hooks from 'leemons-hooks';

export default function ProgramList() {
  const [t] = useTranslateLoader(prefixPN('programs_page'));

  const headerValues = useMemo(
    () => ({
      title: t('page_title'),
      description: t('page_description'),
    }),
    [t]
  );

  return (
    <ContextContainer fullHeight>
      <AdminPageHeader values={headerValues} />

      <Paper color="solid" shadow="none" padding="none">
        <PageContainer>
          <ContextContainer direction="row" fullWidth padded="vertical">
            <Paper>
              <Box>Hola ProgramList</Box>
            </Paper>
            <Paper>
              <Box>Hola ProgramList</Box>
            </Paper>
          </ContextContainer>
        </PageContainer>
      </Paper>
    </ContextContainer>
  );
}

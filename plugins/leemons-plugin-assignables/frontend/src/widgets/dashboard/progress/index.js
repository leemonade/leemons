import React from 'react';
import { Stack, Title, ContextContainer, Paper, Box } from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@assignables/helpers/prefixPN';
import useWelcome from '@dashboard/request/hooks/queries/useWelcome';
import { ProgressChart } from '@assignables/components/ProgressChart';

const MOCK_DATA = [
  {
    label:
      'Bloque 1. Procesos, métodos y actitudes en matemáticas. Procesos, métodos y actitudes en matemáticas',
    value: 3,
  },
  {
    label: 'Bloque 2. Números y álgebra',
    value: 5,
  },
  {
    label: 'Bloque 3. Funciones y gráficos',
    value: 9,
  },
  {
    label: 'Bloque 4. Estadística y probabilidad',
    value: 8,
  },
];

export default function Progress() {
  const { data: welcomeCompleted } = useWelcome();
  const [t] = useTranslateLoader(prefixPN('progress'));

  if (!welcomeCompleted) {
    return null;
  }

  return (
    <ContextContainer>
      <Stack alignItems="center" justifyContent="space-between">
        <Title order={2}>{t('tabTitle')}</Title>
      </Stack>
      <Paper shadow="none">
        <ContextContainer title={t('chartTitle')}>
          <Box>
            <ProgressChart data={MOCK_DATA} maxValue={10} passValue={5} height={390} />
          </Box>
        </ContextContainer>
      </Paper>
    </ContextContainer>
  );
}

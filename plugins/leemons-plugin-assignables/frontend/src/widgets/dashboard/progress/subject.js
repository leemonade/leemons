import React from 'react';
import { Stack, Title, ContextContainer, Paper, Box } from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@assignables/helpers/prefixPN';
import useWelcome from '@dashboard/request/hooks/queries/useWelcome';
import { ProgressChart } from '@assignables/components/ProgressChart';
import { useIsStudent } from '@academic-portfolio/hooks';

const STUDENT_MOCK_DATA = [
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

const TEACHER_MOCK_DATA = [
  { label: '0', value: 2 },
  { label: '1', value: 3 },
  { label: '2', value: 4 },
  { label: '3', value: 5 },
  { label: '4', value: 6 },
  { label: '5', value: 7 },
  { label: '6', value: 8 },
  { label: '7', value: 7 },
  { label: '8', value: 6 },
  { label: '9', value: 5 },
  { label: '10', value: 4 },
];

export default function Progress() {
  const { data: welcomeCompleted } = useWelcome();
  const isStudent = useIsStudent();
  const [t] = useTranslateLoader(prefixPN('progress'));

  if (!welcomeCompleted || isStudent === null) {
    return null;
  }

  return (
    <ContextContainer>
      <Stack alignItems="center" justifyContent="space-between">
        <Title order={2}>{t('tabTitle')}</Title>
      </Stack>
      <Paper shadow="none">
        <ProgressChart
          data={isStudent ? STUDENT_MOCK_DATA : TEACHER_MOCK_DATA}
          maxValue={isStudent ? 10 : undefined}
          passValue={isStudent ? 5 : undefined}
          height={390}
          hideMarkers={!isStudent}
          barColorFromLabel={!isStudent}
          hideTooltip={!isStudent}
          hideLabels={!isStudent}
        />
      </Paper>
    </ContextContainer>
  );
}
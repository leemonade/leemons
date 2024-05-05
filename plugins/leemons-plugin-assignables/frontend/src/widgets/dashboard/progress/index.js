import React from 'react';
import { ContextContainer, Box } from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@assignables/helpers/prefixPN';
import useWelcome from '@dashboard/request/hooks/queries/useWelcome';
import { ProgressChart } from '@assignables/components/ProgressChart';
import { useIsStudent } from '@academic-portfolio/hooks';

const MOCK_DATA = [
  {
    label: 'Filosofía',
    value: 9,
  },
  {
    label: 'Geografía e Historia',
    value: 8,
  },
  {
    label: 'Arte y Creación',
    value: 7,
  },
  {
    label: 'Educación Cívica',
    value: 6,
  },
  {
    label: 'Lengua y Literatura',
    value: 6,
  },
  {
    label: 'Inglés',
    value: 5,
  },
  {
    label: 'Matemáticas',
    value: 4,
  },
  {
    label: 'Biología',
    value: 3,
  },
  {
    label: 'Historia del Arte',
    value: 2,
  },
];

export default function Progress() {
  const { data: welcomeCompleted } = useWelcome();
  const isStudent = useIsStudent();
  const [t] = useTranslateLoader(prefixPN('progress'));

  if (!welcomeCompleted || !isStudent) {
    return null;
  }

  return (
    <ContextContainer title={t('chartTitle')}>
      <Box pt={10}>
        <ProgressChart data={MOCK_DATA} maxValue={10} passValue={5} height={390} />
      </Box>
    </ContextContainer>
  );
}

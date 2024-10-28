import { Box, Stack, Text } from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';

import { prefixPN } from '@dashboard/helpers';

export default function EmptyState() {
  const [t] = useTranslateLoader(prefixPN('dashboardNotEnrolled'));
  return (
    <Box
      sx={(theme) => ({
        padding: theme.other.global.spacing.padding.lg,
      })}
    >
      <Stack
        spacing={8}
        justifyContent="center"
        alignItems="center"
        fullWidth
        direction="column"
        sx={(theme) => ({
          padding: theme.spacing[8],
          backgroundColor: theme.other.global.background.color.surface.muted,
        })}
      >
        <Stack spacing={3} alignItems="flex-start" direction="column">
          <Text color="primary" strong>
            👌🏽 {t('title')}
          </Text>
          <Text color="primary">{t('description')}</Text>
        </Stack>
      </Stack>
    </Box>
  );
}

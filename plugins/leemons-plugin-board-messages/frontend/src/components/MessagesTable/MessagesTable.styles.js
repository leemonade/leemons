import { createStyles } from '@bubbles-ui/components';

// eslint-disable-next-line import/prefer-default-export
export const MessagesTableStyles = createStyles((theme) => {
  const { spacing } = theme?.other?.global ?? {};
  return {
    root: {
      display: 'flex',
      flexDirection: 'column',
      gap: spacing?.gap?.lg,
      padding: spacing?.padding?.lg,
    },
  };
});

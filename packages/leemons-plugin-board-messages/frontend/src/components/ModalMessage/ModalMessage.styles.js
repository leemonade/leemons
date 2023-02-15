import { createStyles } from '@bubbles-ui/components';

// eslint-disable-next-line import/prefer-default-export
export const ModalMessageStyles = createStyles((theme, {}) => {
  const globalTheme = theme.other.global;
  return {
    root: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
    },
    title: {
      ...globalTheme.content.typo.heading.xlg,
      color: globalTheme.content.color.text.emphasis,
    },
    message: {
      ...globalTheme.content.typo.body.lg,
      color: globalTheme.content.color.text.default,
    },
    buttonRow: {
      display: 'flex',
      justifyContent: 'flex-end',
    },
  };
});

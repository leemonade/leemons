import { createStyles, getHtmlStyles } from '@bubbles-ui/components';

// eslint-disable-next-line import/prefer-default-export
export const ModalMessageStyles = createStyles((theme) => {
  const { root: htmlStyles } = getHtmlStyles(theme);
  const globalTheme = theme.other.global;
  return {
    root: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
    },
    title: {
      ...globalTheme.content.typo.heading.lg,
      color: globalTheme.content.color.text.emphasis,
    },
    message: {
      ...htmlStyles,
      ...globalTheme.content.typo.body.md,
    },
    buttonRow: {
      display: 'flex',
      justifyContent: 'flex-end',
    },
  };
});

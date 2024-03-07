import { createStyles, getBoxShadowFromToken, getHtmlStyles } from '@bubbles-ui/components';

// eslint-disable-next-line import/prefer-default-export
export const BannerMessageStyles = createStyles((theme) => {
  const globalTheme = theme.other.global;
  const { root: htmlStyles } = getHtmlStyles(theme);
  return {
    root: {
      display: 'flex',
      flexDirection: 'column',
      gap: 32,
    },
    messageWrapper: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    messageRoot: {
      minWidth: '70%',
      display: 'flex',
      ...getBoxShadowFromToken(globalTheme.shadow[200]),
      border: `4px solid ${globalTheme.border.color.line['default--reverse']}`,
    },
    contentWrapper: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
      paddingInline: 24,
      paddingBlock: 16,
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

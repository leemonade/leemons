import { createStyles, getBoxShadowFromToken } from '@bubbles-ui/components';

// eslint-disable-next-line import/prefer-default-export
export const BannerMessageStyles = createStyles((theme, {}) => {
  const globalTheme = theme.other.global;
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

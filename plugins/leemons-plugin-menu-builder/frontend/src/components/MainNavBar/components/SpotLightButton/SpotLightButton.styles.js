import { createStyles } from '@bubbles-ui/components';

export const SpotLightButtonStyles = createStyles((theme, { lightMode }) => {
  const leemonsStyles = theme.other;
  return {
    buttonWrapper: {
      padding: '12px 16px 12px 18px',
      width: 'auto',
      display: 'flex',
      alignItems: 'center',
      gap: '12px ',
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: lightMode
          ? leemonsStyles.menu.background.color.main.hover
          : leemonsStyles.menu.background.color.main['hover--dark'],
      },
      '&:active': {
        backgroundColor: '#DEF2F0',
      },
    },
    icon: {
      width: '18px',
      height: '18px',
      color: lightMode
        ? leemonsStyles.menu.content.color.main.default
        : leemonsStyles.menu.content.color.main['default--reverse'],
    },
    text: {
      ...leemonsStyles.menu.content.typo.md,
      lineHeight: '24px',
      color: lightMode
        ? leemonsStyles.menu.content.color.main.default
        : leemonsStyles.menu.content.color.main['default--reverse'],
    },
  };
});

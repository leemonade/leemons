import { createStyles, getBoxShadowFromToken } from '@bubbles-ui/components';

const WelcomeCardStyles = createStyles((theme, { linkTo }) => {
  const cardTheme = theme.other.cardLibrary;
  const cardShadow = getBoxShadowFromToken(cardTheme.shadow.hover);
  return {
    root: {
      display: 'flex',
      flexDirection: 'column',
      width: 376,
      height: 369,
      borderRadius: 4,
      backgroundColor: theme.colors.white,
      border: `1px solid #E0E0E0`,
      cursor: linkTo ? 'pointer' : 'default',
      '&:hover': {
        boxShadow: cardShadow.boxShadow,
      },
    },
    cover: {
      display: 'flex',
      justifyContent: 'center',
      zIndex: 1,
      width: '100%',
      height: 221,
    },
    content: {
      padding: 24,
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
      backgroundColor: '#FFFFFF',
      height: 148,
      zIndex: 2,
    },
  };
});

export { WelcomeCardStyles };

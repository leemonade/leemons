import { createStyles } from '@bubbles-ui/components';

const WelcomeCardStyles = createStyles((theme, {}) =>
  // console.log('styles');
  ({
    root: {
      backgroundColor: theme.colors.mainWhite,
      borderRadius: 8,
      maxWidth: 768,
      width: '100%',
      marginTop: 45,
      padding: 24,
    },
  })
);

export default WelcomeCardStyles;

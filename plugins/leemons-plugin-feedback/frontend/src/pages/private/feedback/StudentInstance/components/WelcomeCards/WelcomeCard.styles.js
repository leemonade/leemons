import { createStyles } from '@bubbles-ui/components';

const WelcomeCardStyles = createStyles((theme) => ({
  root: {
    backgroundColor: theme.colors.mainWhite,
    borderRadius: 8,
    // maxWidth: 768,
    width: '100%',
    padding: 24,
  },
  image: {
    width: '100%',
    height: 'auto',
  },
}));

export default WelcomeCardStyles;

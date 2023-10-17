import { createStyles } from '@bubbles-ui/components';

// eslint-disable-next-line import/prefer-default-export
export const MembersListStyles = createStyles((theme, { opened }) => ({
  root: {
    position: 'absolute',
    transition: 'transform 0.3s ease-in-out',
    left: 361,
    top: 0,
    width: 360,
    height: '100%',
    overflow: 'hidden',
    backgroundColor: theme.colors.mainWhite,
    transform: `translateX(${!opened ? 0 : -721}px)`,
    boxShadow: theme.shadows.shadow04,
  },
  header: {
    paddingTop: 16,
    paddingRight: 8,
    textAlign: 'right',
    backgroundColor: theme.colors.mainWhite,
  },
  title: {
    paddingInline: 24,
    paddingBlock: 16,
    display: 'block',
    backgroundColor: theme.colors.mainWhite,
  },
  userWrapper: {
    padding: 16,
    backgroundColor: theme.colors.ui03,
  },
}));

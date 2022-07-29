import { createStyles } from '@bubbles-ui/components';

// eslint-disable-next-line import/prefer-default-export
export const MembersListStyles = createStyles((theme, { opened }) => ({
  root: {
    width: opened ? 360 : 0,
    overflow: 'hidden',
    backgroundColor: theme.colors.ui03,
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

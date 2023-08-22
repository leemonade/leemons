import { createStyles } from '@bubbles-ui/components';

// eslint-disable-next-line import/prefer-default-export
export const ChatListDrawerIntermediateStyles = createStyles((theme) => ({
  wrapper: {
    position: 'relative',
    zIndex: 9999,
    display: 'flex',
    height: '100%',
    justifyContent: 'start',
    borderLeft: `1px solid ${theme.colors.ui01}`,
    width: 430,
    flexDirection: 'column',
  },
  header: {
    padding: `${theme.spacing[2]}px ${theme.spacing[4]}px`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.mainWhite,
    zIndex: 2,
    button: {
      color: theme.other.buttonAction.content.color.primary.default,
    },
  },
  headerRight: {
    display: 'flex',
    justifyContent: 'end',
    alignItems: 'center',
    gap: theme.spacing[2],
  },
  config: {
    padding: theme.spacing[2],
    maxWidth: '250px',
    '.mantine-Button-inner': {
      justifyContent: 'start',
    },
  },
  title: {
    paddingLeft: theme.spacing[7],
    paddingRight: theme.spacing[7],
    paddingBottom: theme.spacing[6],
  },
  input: {
    paddingLeft: theme.spacing[4],
    paddingRight: theme.spacing[4],
    paddingBottom: theme.spacing[4],
  },
  itemsList: {
    marginTop: theme.spacing[6],
    overflowY: 'auto',
  },
}));

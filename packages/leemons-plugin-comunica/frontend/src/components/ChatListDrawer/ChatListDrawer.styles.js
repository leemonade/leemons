import { createStyles } from '@bubbles-ui/components';

// eslint-disable-next-line import/prefer-default-export
export const ChatListDrawerStyles = createStyles((theme) => ({
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
    padding: 16,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.mainWhite,
    zIndex: 2,
  },
  headerRight: {
    display: 'flex',
    justifyContent: 'end',
    alignItems: 'center',
    gap: theme.spacing[2],
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
  listItems: {
    overflowY: 'auto',
  },
  filterContainer: {
    padding: theme.spacing[4],
  },
  filterClean: {
    padding: theme.spacing[4],
    borderTop: `1px solid ${theme.other.global.border.color.line.muted}`,
  },
  config: {
    padding: theme.spacing[2],
    maxWidth: '250px',
    '.mantine-Button-inner': {
      justifyContent: 'start',
    },
  },
}));

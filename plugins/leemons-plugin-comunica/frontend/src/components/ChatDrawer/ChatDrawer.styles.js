import { createStyles } from '@bubbles-ui/components';

// eslint-disable-next-line import/prefer-default-export
export const ChatDrawerStyles = createStyles((theme) => ({
  wrapper: {
    position: 'relative',
    zIndex: 9999,
    display: 'flex',
    height: '100%',
    justifyContent: 'start',
    borderLeft: `1px solid ${theme.colors.ui01}`,
    width: 400,
    flexDirection: 'column',
  },
  header: {
    padding: `${theme.spacing[2]}px ${theme.spacing[4]}px`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.mainWhite,
    zIndex: 2,
    button: {
      color: theme.other.buttonAction.content.color.primary.default,
    },
    minHeight: 72,
  },
  headerWrapper: {
    backgroundColor: 'white',
    paddingBottom: theme.spacing[3],
  },
  messages: {
    padding: 16,
  },
  date: {
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    marginTop: theme.spacing[4],
    marginBottom: theme.spacing[4],
  },
  sendMessage: {
    display: 'flex',
    alignItems: 'end',
    padding: theme.spacing[4],
    gap: theme.spacing[2],
    backgroundColor: theme.colors.ui03,
  },
  textarea: {
    flex: 1,
  },
  config: {
    padding: theme.spacing[2],
    maxWidth: '250px',
    '.mantine-Button-inner': {
      justifyContent: 'start',
    },
  },
}));

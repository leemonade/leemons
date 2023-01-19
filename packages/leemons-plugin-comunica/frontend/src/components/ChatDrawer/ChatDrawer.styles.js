import { createStyles } from '@bubbles-ui/components';

// eslint-disable-next-line import/prefer-default-export
export const ChatDrawerStyles = createStyles((theme) => ({
  wrapper: {
    position: 'relative',
    zIndex: 9999,
    display: 'flex',
    height: '100%',
    justifyContent: 'end',
    borderLeft: `1px solid ${theme.colors.ui01}`,
    width: 360,
    flexDirection: 'column',
  },
  header: {
    padding: 16,
    display: 'flex',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.mainWhite,
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.15)',
    zIndex: 2,
  },
  chatWrapper: {
    height: '100%',
    display: 'flex',
  },
  messages: {
    backgroundColor: theme.colors.ui03,
    flex: 1,
    padding: 16,
    overflowY: 'auto',
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
    paddingInline: 8,
    paddingBlock: 16,
    gap: 8,
    backgroundColor: theme.colors.mainWhite,
    boxShadow: '0px -4px 8px rgba(0, 0, 0, 0.15)',
  },
  textarea: {
    flex: 1,
  },
}));

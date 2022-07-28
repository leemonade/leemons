import { createStyles } from '@bubbles-ui/components';

// eslint-disable-next-line import/prefer-default-export
export const ChatDrawerStyles = createStyles((theme, {}) => ({
  wrapper: {
    display: 'flex',
    height: '100%',
    justifyContent: 'end',
  },
  header: {
    padding: 16,
    display: 'flex',
    justifyContent: 'space-between',
    width: 360,
  },
  chatWrapper: {
    borderLeft: `1px solid ${theme.colors.ui01}`,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  messages: {
    flex: 1,
    backgroundColor: theme.colors.ui03,
    padding: 16,
    display: 'flex',
    justifyContent: 'center',
  },
  sendMessage: {
    display: 'flex',
    alignItems: 'center',
    paddingInline: 8,
    paddingBlock: 16,
    gap: 8,
  },
}));

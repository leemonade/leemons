import { createStyles } from '@bubbles-ui/components';

// eslint-disable-next-line import/prefer-default-export

export const ChatAddUsersDrawerStyles = createStyles((theme) => ({
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
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.mainWhite,
    zIndex: 2,
    button: {
      color: theme.other.buttonAction.content.color.primary.default,
    },
  },
  content: {
    padding: theme.spacing[5],
    paddingTop: 0,
    flex: 1,
    overflowY: 'auto',
  },
  title: {
    ...theme.other.global.content.typo.heading.md,
    color: theme.other.global.content.color.text.default,
    marginBottom: theme.spacing[4],
  },
  participants: {
    marginBottom: theme.spacing[2],
    ...theme.other.global.content.typo.body['lg--bold'],
    color: theme.other.global.content.color.text.default,
  },
  userInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfoIcons: {
    display: 'flex',
    gap: theme.spacing[2],
  },
  line: {
    width: '100%',
    height: 1,
    backgroundColor: theme.other.divider.background.color.default,
  },
  searchTitle: {
    ...theme.other.global.content.typo.body['lg--bold'],
    color: theme.other.global.content.color.text.default,
    marginBottom: theme.spacing[3],
  },
  userAgentItem: {
    cursor: 'pointer',
    marginLeft: -theme.spacing[5],
    marginRight: -theme.spacing[5],
    paddingLeft: theme.spacing[5],
    paddingRight: theme.spacing[5],
    display: 'flex',
    alignItems: 'center',
    '.mantine-UserDisplayItem-root': {
      flex: 1,
    },
    '&:hover': {
      backgroundColor: theme.other.global.background.color.surface.subtle,
    },
  },
  userAgents: {
    marginTop: theme.spacing[3],
  },
  results: {
    ...theme.other.input.content.typo,
    color: theme.other.global.content.color.text.default,
    paddingTop: theme.spacing[3],
    paddingBottom: theme.spacing[3],
  },
  buttonActions: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'end',
    gap: theme.spacing[2],
    padding: `${theme.spacing[3]}px ${theme.spacing[6]}px`,
    borderTop: `1px solid ${theme.other.global.border.color.line.muted}`,
  },
}));

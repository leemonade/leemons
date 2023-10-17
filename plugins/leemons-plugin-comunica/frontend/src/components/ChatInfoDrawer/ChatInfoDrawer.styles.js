import { createStyles } from '@bubbles-ui/components';

// eslint-disable-next-line import/prefer-default-export
export const ChatInfoDrawerStyles = createStyles((theme) => ({
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
    flex: 1,
    overflowY: 'auto',
  },
  participants: {
    marginTop: theme.spacing[5],
    marginBottom: theme.spacing[2],
    ...theme.other.global.content.typo.body['lg--bold'],
    color: theme.other.global.content.color.text.default,
  },
  showAll: {
    ...theme.other.button.content.typo,
    color: theme.other.link.content.color.default,
    marginTop: theme.spacing[3],
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'end',
    gap: theme.spacing[1],
    cursor: 'pointer',
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
  userAdmin: {
    ...theme.other.buttonText.content.typo,
    color: theme.other.global.content.color.text.default,
  },
  userRemove: {
    color: theme.other.global.content.color.icon.default,
  },
  userMuteIcon: {
    button: {
      color: theme.other.buttonIcon.content.color.terciary.default,
    },
  },
  userMuteIconActive: {
    button: {
      color: theme.other.buttonIcon.content.color.terciary.hover,
    },
  },
  adminIcons: {
    display: 'flex',
  },
  name: {
    marginBottom: theme.spacing[5],
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

import { createStyles } from '@bubbles-ui/components';

// eslint-disable-next-line import/prefer-default-export
export const RoomHeaderStyles = createStyles((theme, {}) => ({
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingLeft: theme.spacing[5],
    paddingRight: theme.spacing[5],
    alignItems: 'center',
  },
  leftSide: {
    display: 'flex',
    gap: theme.spacing[4],
    paddingRight: theme.spacing[4],
  },
  icon: {
    position: 'relative',
    width: 24,
    height: 24,
    minHeight: 24,
    minWidth: 24,
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    img: {
      filter: 'brightness(0) invert(1)',
    },
  },
  subNameContainer: {
    display: 'flex',
    gap: theme.spacing[1],
  },
  title: {
    ...theme.other.global.content.typo.heading.md,
    color: theme.other.global.content.color.text.default,
  },
  subName: {
    marginTop: theme.spacing[1],
    lineHeight: '12px',
    color: theme.other.global.content.color.text.default,
    ...theme.other.global.content.typo.body.sm,
  },
  muteIcon: {
    color: theme.other.global.content.color.icon.default,
  },
}));

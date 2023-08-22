import { createStyles } from '@bubbles-ui/components';

// eslint-disable-next-line import/prefer-default-export
export const useAvatarActivityStyles = createStyles((theme, { activityColor }) => ({
  activityType: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    background: activityColor || theme.other.global.background.color.surface.emphasis,
    borderRadius: theme.radius.md,

    bottom: theme.spacing[1],
    left: theme.spacing[1],
    width: 20,
    height: 20,
  },
  activityTypeIcon: {
    width: 12,
    height: 12,
    filter: 'brightness(0) invert(1)',
  },
  cover: {
    position: 'relative',
    border: `1px solid ${theme.other.global.border.color.line.muted}`,
    borderRadius: theme.other.global.border.radius.sm,
  },
  coverFallback: {
    width: 40,
    height: 40,
    background: theme.other.global.background.color.surface.subtle,
  },
}));

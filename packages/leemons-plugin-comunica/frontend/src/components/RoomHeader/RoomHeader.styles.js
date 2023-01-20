import { createStyles } from '@bubbles-ui/components';

// eslint-disable-next-line import/prefer-default-export
export const RoomHeaderStyles = createStyles((theme, { imageSquare }) => ({
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingLeft: theme.spacing[5],
    paddingRight: theme.spacing[5],
  },
  leftSide: {
    display: 'flex',
    gap: theme.spacing[4],
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
  subName: {
    marginTop: theme.spacing[1],
    lineHeight: '12px',
  },
}));

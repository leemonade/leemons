import { createStyles } from '@bubbles-ui/components';

// eslint-disable-next-line import/prefer-default-export
export const RoomAvatarStyles = createStyles((theme, { size, imageSquare }) => ({
  itemImage: {
    display: 'inline-block',
  },
  itemContent: {
    position: 'relative',
  },
  image: {
    borderRadius: imageSquare ? '2px' : '50%',
    img: {
      borderRadius: imageSquare ? '2px' : '50%',
    },
  },
  attachedIcon: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: size * 0.3571,
    height: size * 0.3571,
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.other.badge.background.color.secondary.default,
    img: {
      filter: 'brightness(0) invert(1)',
    },
  },
  itemIconContainer: {
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: size,
    height: size,
    img: {
      filter: 'brightness(0) invert(1)',
    },
  },
}));

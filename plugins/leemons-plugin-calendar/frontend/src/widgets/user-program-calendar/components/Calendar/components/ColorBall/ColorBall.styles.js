import { createStyles } from '@bubbles-ui/components';

const ColorBallStyles = createStyles((theme) => ({
  ballsContainer: {
    display: 'flex',
    position: 'relative',
    justifyContent: 'center',
  },
  roundedBall: {
    width: theme.other.core.dimension['100'],
    height: theme.other.core.dimension['100'],
    position: 'absolute',
    borderRadius: '50%',
    marginLeft: '1px',
    top: '6px',
  },
  twoEvents: {
    display: 'flex',
    gap: 2,
  },
  eventCount: {
    color: 'white',
    fontSize: 9,
  },
  roundedBall2: {
    width: theme.other.core.dimension['100'],
    height: theme.other.core.dimension['100'],
    position: 'absolute',
    borderRadius: '50%',
    marginLeft: '-8px',
    top: '6px',
  },
  blackBall: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    backgroundColor: theme.other.core.color.neutral['700'],
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: theme.other.core.dimension['50'],
  },
}));

export { ColorBallStyles };

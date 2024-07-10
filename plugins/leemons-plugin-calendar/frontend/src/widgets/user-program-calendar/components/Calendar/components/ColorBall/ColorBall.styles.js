import { createStyles } from '@bubbles-ui/components';

const ColorBallStyles = createStyles(() => ({
  ballsContainer: {
    display: 'flex',
    position: 'relative',
    justifyContent: 'center',
  },
  roundedBall: {
    width: '8px',
    height: '8px',
    position: 'absolute',
    borderRadius: '50%',
    marginLeft: '2px',
    top: '6px',
  },
  twoEvents: {
    display: 'flex',
    gap: 4,
  },
  eventCount: {
    color: 'white',
    fontSize: 9,
  },
  roundedBall2: {
    width: '8px',
    height: '8px',
    position: 'absolute',
    borderRadius: '50%',
    marginLeft: '-10px',
    top: '6px',
  },
  blackBall: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    backgroundColor: '#51525c',
    display: 'grid',
    placeContent: 'center',
    position: 'absolute',
    top: '2px',
  },
}));

export { ColorBallStyles };

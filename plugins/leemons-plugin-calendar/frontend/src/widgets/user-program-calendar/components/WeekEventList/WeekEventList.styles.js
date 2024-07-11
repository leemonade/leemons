import { createStyles } from '@bubbles-ui/components';

const WeekEventListStyles = createStyles((theme) => ({
  weekEventList: {
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: theme.other.core.dimension['500'],
    overflowY: 'scroll',
    overflowX: 'hidden',
    height: 380,
    width: '78%',
  },
}));

export { WeekEventListStyles };

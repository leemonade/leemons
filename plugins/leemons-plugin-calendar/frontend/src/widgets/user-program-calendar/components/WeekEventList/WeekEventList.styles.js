import { createStyles } from '@bubbles-ui/components';

const WeekEventListStyles = createStyles((theme) => ({
  weekEventList: {
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: 42,
    overflowY: 'scroll',
    height: 380,
    width: '78%',
  },
}));

export { WeekEventListStyles };

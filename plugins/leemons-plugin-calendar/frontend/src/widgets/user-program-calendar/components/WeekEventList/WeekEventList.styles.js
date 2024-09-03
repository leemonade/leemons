import { createStyles } from '@bubbles-ui/components';

const WeekEventListStyles = createStyles((theme) => ({
  weekEventList: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    overflowY: 'auto',
    overflowX: 'hidden',
    height: 380,
  },
}));

export { WeekEventListStyles };

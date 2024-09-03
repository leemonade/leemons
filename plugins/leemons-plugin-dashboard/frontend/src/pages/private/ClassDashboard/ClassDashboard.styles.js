import { createStyles } from '@bubbles-ui/components';

const ClassDashboardStyles = createStyles(() => ({
  classBar: {},
  widgets: {
    height: 'calc(100% - 80px)',
  },
  widgetTab: {
    '& > div > div > div:empty': {
      display: 'none',
    },
  },
}));

export { ClassDashboardStyles };

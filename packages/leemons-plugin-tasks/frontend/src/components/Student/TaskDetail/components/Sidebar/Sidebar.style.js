import { createStyles } from '@bubbles-ui/components';

export const sidebarStyles = createStyles((theme, onlyNext) => ({
  sidebar: {
    minWidth: '280px',
    maxWidth: '280px',
    width: '280px',
    minHeight: '100%',
    padding: theme.spacing[4],
  },
  sidebarColor: {
    backgroundColor: theme.colors.ui03,
  },
}));

export default sidebarStyles;

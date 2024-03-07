import { createStyles } from '@bubbles-ui/components';

export const sidebarStyles = createStyles((theme, onlyNext) => ({
  sidebar: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing[4],
    minWidth: '280px',
    maxWidth: '280px',
    width: '280px',
    minHeight: '100%',
    padding: theme.spacing[4],
  },
  sidebarColor: {
    backgroundColor: theme.colors.ui03,
  },
  sidebarSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing[4],
  },
  resourceContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing[1],
    width: '100%',
  },
  resource: {
    background: theme.white,
    padding: theme.spacing[4],
    display: 'flex',
    flexDirection: 'row',
    gap: theme.spacing[4],
    borderRadius: theme.spacing[1],
  },
  resourceContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing[1],
  },
}));

export default sidebarStyles;

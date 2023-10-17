import { createStyles, getFontExpressive } from '@bubbles-ui/components';

export const KanbanFiltersStyles = createStyles((theme, {}) => {
  return {
    root: {
      ...getFontExpressive(theme.fontSizes['2']),
      width: '100%',
      height: '58px',
      padding: `${theme.spacing[2]}px ${theme.spacing[4]}px `,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: theme.colors.uiBackground01,
    },
    icon: {
      width: '22.5px',
      height: '22.5px',
    },
    title: {
      fontWeight: 400,
      marginLeft: theme.spacing[2],
    },
    select: {
      marginLeft: theme.spacing[7],
      marginRight: theme.spacing[7],
      '.mantine-Select-input': {
        marginBottom: '0!important',
      },
    },
  };
});

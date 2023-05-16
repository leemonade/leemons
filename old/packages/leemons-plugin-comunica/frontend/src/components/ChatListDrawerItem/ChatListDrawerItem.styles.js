import { createStyles } from '@bubbles-ui/components';

// eslint-disable-next-line import/prefer-default-export
export const ChatListDrawerItemStyles = createStyles((theme, { type }) => {
  const subName = { lineHeight: '1.2rem' };
  return {
    item: {
      paddingLeft: theme.spacing[6],
      paddingRight: theme.spacing[6],
      paddingBottom: theme.spacing[3],
      paddingTop: theme.spacing[3],
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing[4],
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: theme.other.global.background.color.surface.subtle,
      },
    },
    itemTitleContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing[1],
      paddingRight: theme.spacing[4],
      width: '100%',
    },
    itemIcons: {
      display: 'flex',
      color: theme.other.global.content.color.icon.default,
      gap: theme.spacing[2],
    },
    itemContent: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      overflow: 'hidden',
    },
    subName,
  };
});

import { createStyles, getFontProductive } from '@bubbles-ui/components';
import { colord } from 'colord';

export const KanbanTaskCardStyles = createStyles((theme, { bgColor, titleMargin, progress }) => {
  return {
    root: {
      ...getFontProductive(theme.fontSizes[1], 400),
      width: '100%',
      backgroundColor: theme.colors.uiBackground04,
      borderWidth: '2px',
      borderStyle: 'solid',
      borderColor: theme.colors.interactive03h,
      padding: 0,
      overflow: 'hidden',
      whiteSpace: 'normal'
    },
    title: {
      ...getFontProductive(theme.fontSizes[2], 500),
      color: theme.colors.text01,
      marginBottom: titleMargin ? theme.spacing[4] : 0
    },
    topSection: {
      padding: theme.spacing[4]
    },
    bottomSection: {
      padding: theme.spacing[4],
      paddingTop: theme.spacing[3],
      paddingBottom: theme.spacing[3],
      backgroundColor: bgColor || theme.colors.uiBackground01,
      position: 'relative'
    },
    line: {
      backgroundColor: theme.colors.interactive03h,
      width: '100%',
      height: '1px',
      marginBottom: theme.spacing[4]
    },
    bottomSectionBg: {
      display: bgColor ? 'block' : 'none',
      position: 'absolute',
      zIndex: 1,
      width: '100%',
      height: '100%',
      left: 0,
      top: 0,
      backgroundColor: 'rgba(246, 245, 247, 0.93)'
    },
    bottomSectionContent: {
      position: 'relative',
      zIndex: 2
    },
    avatar: {
      display: 'flex',
      alignItems: 'center',
      color: theme.colors.text03
    },
    progress: {
      display: 'flex',
      alignItems: 'end',
      flexDirection: 'column',
      color: theme.colors.text02,
      ...getFontProductive(theme.fontSizes[1])
    },
    progressOut: {
      marginTop: theme.spacing[1],
      width: '100%',
      height: '8px',
      backgroundColor: colord(theme.colors.uiBackground03).alpha(0.3).toRgbString()
    },
    progressIn: {
      width: `${progress}%`,
      height: '100%',
      backgroundColor: theme.colors.uiBackground03
    },
    description: {
      marginBottom: theme.spacing[5]
    },
    icon: {
      position: 'absolute',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
      width: '16px',
      height: '16px',
      color: theme.colors.text07,
      img: {
        filter: 'brightness(0) invert(1)'
      }
    }
  };
});

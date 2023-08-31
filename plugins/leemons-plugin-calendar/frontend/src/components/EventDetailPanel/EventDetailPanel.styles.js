import { createStyles, getFontExpressive } from '@bubbles-ui/components';

export const EventDetailPanelStyles = createStyles((theme, {}) => {
  return {
    root: {
      ...getFontExpressive(theme.fontSizes['2']),
    },
    content: {
      backgroundColor: 'red',
    },
    section: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
    },
    sectionRow: {
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      height: 36,
      maxHeight: 36,
    },
    icon: {
      color: theme.colors.text05,
    },
    subjectIcon: {
      filter: 'brightness(0) invert(0.57)',
    },
  };
});

import { createStyles } from '@bubbles-ui/components';

// eslint-disable-next-line import/prefer-default-export
export const DetailDrawerStyles = createStyles((theme) => {
  const globalTheme = theme.other.global;
  return {
    root: {
      display: 'flex',
      flexDirection: 'column',
      gap: 28,
      marginTop: -20,
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
    },
    title: {
      ...globalTheme.content.typo.heading.md,
      color: globalTheme.content.color.text.default,
    },
    subtitle: {
      ...globalTheme.content.typo.heading.xsm,
      color: globalTheme.content.color.text.default,
    },
    inputRow: {
      display: 'flex',
      gap: 20,
    },
    datesRow: {
      display: 'flex',
      gap: 8,
    },
    buttonRow: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: 16,
    },
    checkboxHelp: {
      marginLeft: 36,
      ...globalTheme.content.typo.body.sm,
      color: globalTheme.content.color.text.muted,
      display: 'flex',
      gap: 8,
      alignItems: 'center',
    },
    overlaps: {
      marginLeft: 52,
      ...globalTheme.content.typo.body.sm,
      color: globalTheme.content.color.text.muted,
    },
  };
});

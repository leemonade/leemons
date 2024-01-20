import { createStyles } from '@bubbles-ui/components';

export const useSubjectPickerStyles = createStyles((theme) => {
  const globalTheme = theme.other.global;

  return {
    subjectPicker: {
      maxWidth: 684,
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      gap: globalTheme.spacing.padding.md,
      alignItems: 'end',
    },
    table: {
      maxWidth: 684,
    },
  };
});

export default useSubjectPickerStyles;

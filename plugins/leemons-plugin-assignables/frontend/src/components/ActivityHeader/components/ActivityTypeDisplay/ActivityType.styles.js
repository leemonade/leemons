import { createStyles } from '@bubbles-ui/components';

const useActivityTypeStyles = createStyles((theme) => {
  const globalTheme = theme.other.global;

  return {
    root: {
      display: 'flex',
      flexDirection: 'row',
      gap: globalTheme.spacing.gap.sm,
      alignItems: 'center',
    },
    icon: {
      position: 'relative',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: 18,
      height: 18,
      color: '#878D96',
    },
    text: {
      fontSize: { ...globalTheme.content.typoMobile.body['sm--bold'] },
      color: globalTheme.content.color.text.default,
      textWrap: 'nowrap',
    },
  };
});

export { useActivityTypeStyles };

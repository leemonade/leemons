import { createStyles } from '@bubbles-ui/components';

export const SubjectHeaderStyles = createStyles((theme, { color, isFirst, isLast }) => {
  return {
    root: {
      width: '100%',
      height: '100%',
      display: 'flex',
      borderLeft: (isFirst || isLast || (!isFirst && !isLast)) && `1px solid #EDEFF5`,
      borderRight: isLast && `1px solid #EDEFF5`,
      // '&:hover': {
      //   border: `1px solid ${theme.colors.interactive01d}`,
      //   backgroundColor: theme.colors.interactive01v1,
      // },
    },
    header: {
      height: 68,
      maxHeight: 68,
      width: '100%',
      textAlign: 'center',
    },
    title: {
      paddingTop: 16,
    },
    iconWrapper: {
      height: 24,
      width: 24,
      borderRadius: '50%',
      backgroundColor: color,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      img: {
        filter: 'brightness(0) invert(1)',
      },
    },
  };
});

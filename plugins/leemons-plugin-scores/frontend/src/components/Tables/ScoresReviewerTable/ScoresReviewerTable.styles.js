import { createStyles } from '@bubbles-ui/components';

export const ScoresReviewerTableStyles = createStyles((theme, {}) => {
  return {
    tableHeaderCell: {
      maxHeight: 120,
      backgroundColor: theme.colors.mainWhite,
      '&:first-of-type': {
        maxWidth: 296,
        position: 'sticky',
        left: '0px',
        zIndex: 3,
      },
    },
  };
});

import { createStyles } from '@bubbles-ui/components';

export const PeriodHeaderStyles = createStyles((theme, { isFirst, isLast, index, length }) => {
  const isFirstColumn = index === 0;
  const isLastColumn = index === length - 1;

  return {
    root: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
      borderLeft:
        ((isFirst && isFirstColumn) ||
          (isLast && isFirstColumn) ||
          (isFirstColumn && !isFirst && !isLast)) &&
        `1px solid #EDEFF5`,
      borderRight: isLast && isLastColumn && `1px solid #EDEFF5`,
      height: 50,
      maxHeight: 50,
    },
  };
});

import { createStyles } from '@bubbles-ui/components';
import { useEffect } from 'react';

const useIntroductionStepStyles = createStyles((theme) => {
  const globalTheme = theme.other.global;

  return {
    root: {
      display: 'flex',
      flexDirection: 'column',
      gap: globalTheme.spacing.padding['2xlg'],
    },
    statementContainer: {
      display: 'flex',
      gap: globalTheme.spacing.gap.xlg,
    },
  };
});

export default useIntroductionStepStyles;

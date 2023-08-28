import { createStyles } from '@mantine/styles';
// import { pxToRem, getPaddings, getFontExpressive, getFontProductive } from '../../../theme.mixins';
import { pxToRem, getPaddings, getFontExpressive, getFontProductive } from '@bubbles-ui/components';

export const RuleConditionStyles = createStyles((theme, {}) => {
  return {
    root: {
      display: 'flex',
      alignItems: 'baseline',
      // padding: pxToRem(8),
      gap: theme.spacing[1],
      marginBottom: theme.spacing[1],
    },
    logicOperator: {
      // marginRight: pxToRem(8),
      width: pxToRem(80),
    },
    sourceSelects: {
      display: 'flex',
      gap: theme.spacing[1],
    },
  };
});

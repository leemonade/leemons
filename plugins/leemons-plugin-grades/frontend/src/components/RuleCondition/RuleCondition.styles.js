import { pxToRem, createStyles } from '@bubbles-ui/components';

const RuleConditionStyles = createStyles((theme) => ({
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
}));

export default RuleConditionStyles;
export { RuleConditionStyles };

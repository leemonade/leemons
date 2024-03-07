import { pxToRem, createStyles } from '@bubbles-ui/components';

const RuleGroupStyles = createStyles((theme) => ({
  root: {
    padding: pxToRem(8),
  },
  draggableGroup: {
    // backgroundColor: '#eee',
    border: `1px solid ${theme.colors.ui01}`,
    // borderRadius: pxToRem(4),
    flex: 1,
    marginBottom: theme.spacing[2],
  },
  logicOperator: {
    // marginRight: pxToRem(8),
    width: pxToRem(80),
  },
  input: {
    // marginBottom: pxToRem(-4),
    // marginRight: pxToRem(8),
  },
  ruleGroup: {
    display: 'flex',
    gap: theme.spacing[1],
    // padding: pxToRem(8),
  },
}));

export default RuleGroupStyles;
export { RuleGroupStyles };

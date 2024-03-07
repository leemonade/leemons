import { pxToRem, createStyles, getFontExpressive } from '@bubbles-ui/components';

const ProgramRulesStyles = createStyles((theme) => ({
  root: {
    ...getFontExpressive(theme.fontSizes['2']),
  },
  gradeSelect: {
    marginLeft: pxToRem(10),
  },
}));

export default ProgramRulesStyles;
export { ProgramRulesStyles };

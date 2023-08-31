import { createStyles } from '@mantine/styles';
import { pxToRem, getPaddings, getFontExpressive, getFontProductive } from '@bubbles-ui/components';

export const ProgramRulesStyles = createStyles((theme, {}) => {
  return {
    root: {
      ...getFontExpressive(theme.fontSizes['2']),
    },
    gradeSelect: {
      marginLeft: pxToRem(10),
    },
  };
});

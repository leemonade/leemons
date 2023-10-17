import { createStyles } from '@bubbles-ui/components';

// eslint-disable-next-line import/prefer-default-export
export const ProgramItemStyles = createStyles((theme, { isSelected }) => ({
  root: {
    width: '100%',
    borderRadius: theme.radius.sm,
    padding: theme.spacing[3],
    backgroundColor: isSelected && theme.colors.interactive01v1,
    border: isSelected && `1px dashed ${theme.colors.interactive01d}`,
    marginBottom: theme.spacing[2],
  },
  icon: {
    width: 18,
    height: 18,
    color: isSelected && `${theme.colors.interactive01} !important`,
  },
  label: {
    color: isSelected && `${theme.colors.interactive01} !important`,
  },
}));

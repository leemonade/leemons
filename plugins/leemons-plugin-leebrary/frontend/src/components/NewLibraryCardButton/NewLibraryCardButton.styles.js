import { createStyles, pxToRem } from '@bubbles-ui/components';

const NewLibraryCardButtonStyles = createStyles((theme, { isMultipleButton }) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.other.global.border.radius.md,
    border: `2px dashed ${theme.other.dropzone.border.color.default}`,
    cursor: 'pointer',
    height: 'auto',
    gap: 6,
    overflow: 'hidden',
    position: 'relative',
    width: '100%',
    minWidth: pxToRem(264),
    maxWidth: pxToRem(330),
    minHeight: isMultipleButton ? pxToRem(184) : pxToRem(396),
    '&:hover': {
      backgroundColor: theme.other.dropzone.background.color.hover,
    },
  },
  label: {
    color: theme.other.global.content.color.text.default,
    ...theme.other.global.content.typo.body['lg--bold'],
  },
  icon: {
    color: theme.other.global.content.color.icon.default,
  },
}));

export default NewLibraryCardButtonStyles;
export { NewLibraryCardButtonStyles };

import { createStyles, pxToRem } from '@bubbles-ui/components';

const VariantItemDisplayStyles = createStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  fileIconRoot: {
    display: 'inline-flex',
    alignItems: 'center',
  },
  fileIconLabel: {
    ...theme.other.cardLibrary.content.typo.sm,
    color: theme.other.cardLibrary.content.color.muted,
    paddingLeft: pxToRem(8),
  },
  fileIconContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  fileLabel: {
    paddingLeft: pxToRem(8),
    color: '#878D96',
    fontSize: pxToRem(12),
  },
}));

export default VariantItemDisplayStyles;
export { VariantItemDisplayStyles };

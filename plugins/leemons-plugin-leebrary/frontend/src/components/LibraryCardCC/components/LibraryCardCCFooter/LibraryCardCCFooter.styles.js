import { createStyles, pxToRem } from '@bubbles-ui/components';

const LibraryCardCCFooterStyles = createStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 38,
    width: '100%',
    bottom: 0,
    padding: `${pxToRem(16)}`,
    paddingTop: '0px',
    position: 'absolute',
    backgroundColor: theme.colors.mainWhite,
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

export { LibraryCardCCFooterStyles };

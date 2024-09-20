import { createStyles, pxToRem, getFontExpressive } from '@bubbles-ui/components';

const LibraryCardFooterStyles = createStyles((theme, { autoHeight }) => ({
  root: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 38,
    width: '100%',
    bottom: 0,
    padding: `${pxToRem(16)}`,
    paddingTop: '0px',
    position: autoHeight ? 'relative' : 'absolute',
    backgroundColor: theme.colors.mainWhite,
  },
  date: {
    color: theme.colors.text04,
    fontSize: pxToRem(11),
  },
  FileIconRoot: {
    ...getFontExpressive(theme.fontSizes['2']),
    display: 'inline-flex',
    alignItems: 'center',
    color: theme.other.core.color.neutral['600'],
  },
  FileIconLabel: {
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
    color: theme.other.core.color.neutral['500'],
    fontSize: pxToRem(12),
  },
  avatars: {
    marginRight: pxToRem(12),
  },
}));

export { LibraryCardFooterStyles };

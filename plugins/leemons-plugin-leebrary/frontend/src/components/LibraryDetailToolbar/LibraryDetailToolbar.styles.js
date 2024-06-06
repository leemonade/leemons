import { createStyles, pxToRem } from '@bubbles-ui/components';

const LibraryDetailToolbarStyles = createStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    color: theme.colors.text05,
    padding: pxToRem(20),
    gap: pxToRem(8),
    backgroundColor: theme.colors.mainWhite,
    width: '100%',
    minHeight: 72,
  },
  button: {
    transition: 'transform 0.2s ease-out',
    color: theme.colors.text05,
  },
  buttons: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  leftContainer: {
    width: '100%',
    gap: pxToRem(8),
    marginLeft: pxToRem(8),

    display: 'flex',
  },
  divider: {
    // display: 'inline-block',
    // verticalAlign: 'middle',
  },
}));

export default LibraryDetailToolbarStyles;
export { LibraryDetailToolbarStyles };

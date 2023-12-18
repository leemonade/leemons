import { createStyles, pxToRem } from '@bubbles-ui/components';

const LibraryDetailToolbarStyles = createStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    color: theme.colors.text05,
    padding: pxToRem(16),
    gap: pxToRem(8),
    backgroundColor: theme.colors.mainWhite,
    width: '100%',
  },
  button: {
    transition: 'transform 0.2s ease-out',
    color: theme.colors.text05,
  },
  buttons: {
    display: 'flex',
    alignItems: 'center',
    gap: pxToRem(8),
    flex: 1,
    justifyContent: 'space-between',
  },
}));

export default LibraryDetailToolbarStyles;
export { LibraryDetailToolbarStyles };

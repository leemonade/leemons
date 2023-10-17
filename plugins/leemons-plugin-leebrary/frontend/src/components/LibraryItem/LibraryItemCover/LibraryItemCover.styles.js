import {
  createStyles,
  pxToRem,
  getPaddings,
  getFontExpressive,
  getFontProductive,
} from '@bubbles-ui/components';
import { getSize } from '../LibraryItem.constants';

export const LibraryItemCoverStyles = createStyles((theme, { cover, color, size = 'sm' }) => {
  const { height, width } = getSize(size);
  return {
    root: {
      ...getFontExpressive(theme.fontSizes['2']),
      flex: 'none',
      height,
      width,
      position: 'relative',
      borderRadius: 4,
      backgroundColor: color || theme.colors.interactive03h,
      overflow: 'hidden',
      margin: theme.spacing[1],
    },
    fileIcon: {
      position: 'absolute',
      bottom: cover ? 0 : theme.spacing[1],
      left: cover ? 0 : theme.spacing[1],
      height: height / 2,
      width: width / 2,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: color || theme.colors.interactive03h,
      zIndex: 9,
    },
  };
});

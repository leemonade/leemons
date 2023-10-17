import { createStyles } from '@bubbles-ui/components';

export const ColorPickerStyles = createStyles((theme, {}) => {
  return {
    root: {
      display: 'flex',
      flexWrap: 'wrap',
      padding: 8,
      gap: 8,
      width: 136,
    },
    swatch: {
      height: 24,
      width: 24,
      borderRadius: 4,
      cursor: 'pointer',
      position: 'relative',
    },
  };
});

import { createStyles } from '@bubbles-ui/components';

const useCoverCopyright = createStyles((theme, { bottomOffset, align }) => {
  const root = {
    position: 'absolute',
    bottom: bottomOffset || 0,
    background: 'rgba(0, 0, 0, 0.6)',
    width: '100%',
    height: 'auto',
    padding: 5,
    zIndex: 50,
  };
  if (align === 'left') {
    root.left = 0;
    delete root.width;
  } else if (align === 'right') {
    root.right = 0;
    delete root.width;
  }

  return {
    root,
  };
});

export default useCoverCopyright;

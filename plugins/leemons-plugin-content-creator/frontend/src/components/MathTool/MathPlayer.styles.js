import { createStyles } from '@bubbles-ui/components';

const MathPlayerStyles = createStyles((theme) => ({
  wrapperLatex: {
    display: 'inline-block',
    padding: '2px 8px',
    borderRadius: 4,
    backgroundColor: '#333F56',
    color: '#EDEFF5',
    '& span': {
      border: 'none',
      outline: 'none',
    },
  },
  wrapperMath: {
    display: 'inline-block',
    backgroundColor: 'transparent',
    color: '#212B3D;',
    '& .katex-html': {
      display: 'none',
    },
  },
}));

export { MathPlayerStyles };

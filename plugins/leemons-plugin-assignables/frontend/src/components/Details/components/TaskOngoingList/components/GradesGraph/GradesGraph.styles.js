import { createStyles } from '@bubbles-ui/components';

export const useGradesGraphStyles = createStyles((theme) => ({
  root: {
    width: '100%',
    height: 300,

    'svg > g > g:nth-child(2) > text': {
      fill: '#878D96!important',
      textTransform: 'uppercase',
    },
    'svg > g > g:nth-child(1) > text': {
      transform: 'translate(36%, 40px)!important',
      fill: '#878D96!important',
      textTransform: 'uppercase',
    },
  },
}));

export default useGradesGraphStyles;

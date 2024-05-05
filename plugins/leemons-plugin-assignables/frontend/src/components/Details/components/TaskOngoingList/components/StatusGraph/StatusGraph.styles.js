import { createStyles } from '@bubbles-ui/components';

export const useStatusGraphStyles = createStyles((theme) => ({
  root: {
    width: '100%',
    height: 600,
    marginBottom: -230,
    'svg > g g:nth-of-type(2) line': {
      stroke: `${theme.colors.uiBackground03} !important`,
      strokeWidth: '2px !important',
      strokeOpacity: 0.4,
    },
    'svg > g g:nth-last-of-type(2) line:first-of-type': {
      display: 'none',
    },
  },
}));

export default useStatusGraphStyles;

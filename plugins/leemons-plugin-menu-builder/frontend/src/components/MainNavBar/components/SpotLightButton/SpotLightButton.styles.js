/* eslint-disable import/prefer-default-export */
import { createStyles } from '@bubbles-ui/components';

export const SpotLightButtonStyles = createStyles((theme) => {
  const leemonsStyles = theme.other;
  return {
    buttonWrapper: {
      padding: '12px 16px 12px 20px',
      width: 'auto',
      display: 'flex',
      alignItems: 'center',
      gap: '12px ',
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: leemonsStyles.menu.background.color.main.hover,
      },
      '&:active': {
        backgroundColor: '#DEF2F0',
      },
    },
    icon: {
      width: '18px',
      height: '18px',
      color: leemonsStyles.menu.content.color.main.default,
    },
    text: {
      ...leemonsStyles.menu.content['typo--regular'],
      lineHeight: '24px',
      color: leemonsStyles.menu.content.color.main.default,
      paddingLeft: 5,
    },
  };
});

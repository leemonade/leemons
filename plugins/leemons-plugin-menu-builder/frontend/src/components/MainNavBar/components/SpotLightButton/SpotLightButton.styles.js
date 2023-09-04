import { createStyles } from '@bubbles-ui/components';

export const SpotLightButtonStyles = createStyles((theme) => {
  console.log(theme);
  const leemonsStyle = theme.other;
  return {
    buttonWrapper: {
      marginRight: '12px',
      padding: '12px 16px 12px 16px',
      width: 'auto',
      display: 'flex',
      alignItems: 'center',
      gap: '12px ',
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: '#F8F9FB',
        // backgroundColor: leemonsStyle.menu.background.color.main.hover,
      },
      '&:focus': {
        backgroundColor: 'red',
      },
      '&:active': {
        backgroundColor: '#DEF2F0',
      },
    },
    icon: {
      width: '18px',
      height: '18px',
      color: leemonsStyle.menu.content.color.main.default,
    },
    text: {
      ...leemonsStyle.menu.content.typo.md,
    },
  };
});

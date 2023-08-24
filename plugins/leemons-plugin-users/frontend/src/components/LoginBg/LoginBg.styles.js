import { createStyles, getPaddings } from '@bubbles-ui/components';

export const LoginBgStyles = createStyles((theme, { logoWidth = 160 }) => {
  return {
    root: {
      position: 'relative',
      height: '100vh',
      width: 'fit-content',
    },
    content: {
      position: 'absolute',
      top: 0,
      left: 0,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
      justifyContent: 'space-between',
      ...getPaddings(theme.spacing['4'], theme.spacing['5']),
    },
    logo: {
      width: `${logoWidth}px!important`,
      height: 'auto!important',
    },
    footer: {
      height: 35,
    },
  };
});

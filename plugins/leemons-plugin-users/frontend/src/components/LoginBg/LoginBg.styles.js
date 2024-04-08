import { createStyles } from '@bubbles-ui/components';

const LoginBgStyles = createStyles((theme, { logoWidth = 160 }) => ({
  hero: {
    paddingInline: 20,
    position: 'relative',
  },
  heroImage: {
    width: `100% !important`,
    height: 'auto !important',
  },
  logo: {
    width: `${logoWidth}px !important`,
    height: 'auto !important',
  },
  footer: {
    height: 35,
  },
}));

export { LoginBgStyles };

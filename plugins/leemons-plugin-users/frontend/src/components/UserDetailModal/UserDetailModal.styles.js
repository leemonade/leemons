import {
  createStyles,
  pxToRem,
  getPaddings,
  getFontExpressive,
  getFontProductive,
} from '@bubbles-ui/components';

export const UserDetailModalStyles = createStyles((theme, {}) => {
  return {
    root: {
      ...getFontExpressive(theme.fontSizes['2']),
    },
    personalInformation: {
      display: 'flex',
    },
    labelCol: {
      display: 'flex',
      flexDirection: 'column',
      gap: 30,
      span: { fontWeight: 500 },
      marginRight: 40,
    },
    infoCol: {
      display: 'flex',
      flexDirection: 'column',
      gap: 30,
    },
  };
});

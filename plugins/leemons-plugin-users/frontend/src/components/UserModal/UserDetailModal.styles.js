import { createStyles, getFontExpressive } from '@bubbles-ui/components';

const UserDetailModalStyles = createStyles((theme, {}) => ({
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
}));

export default UserDetailModalStyles;
export { UserDetailModalStyles };

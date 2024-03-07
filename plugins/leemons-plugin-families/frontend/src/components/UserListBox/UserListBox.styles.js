import { createStyles } from '@bubbles-ui/components';

// eslint-disable-next-line import/prefer-default-export
export const UserListBoxStyles = createStyles((theme, { isEmpty, fullWidth }) => ({
  root: {},
  addIcon: {
    color: theme.colors.interactive01,
    cursor: 'pointer',
  },
  deleteIcon: {
    cursor: 'pointer',
    color: theme.colors.text05,
  },
  listWrapper: {
    backgroundColor: isEmpty && theme.colors.ui03,
    border: isEmpty && `1px solid ${theme.colors.ui01}`,
    borderRadius: 2,
    width: fullWidth ? '100%' : 320,
    cursor: isEmpty && 'pointer',
    paddingBlock: isEmpty && 44,
  },
  userList: {
    height: '100%',
    width: '100%',
  },
  userWrapper: {
    padding: 16,
    border: `1px solid ${theme.colors.ui02}`,
    borderRadius: 2,
    display: 'flex',
    justifyContent: 'space-between',
  },
  iconWrapper: {
    color: theme.colors.text05,
  },
  noUsersPlaceholder: {
    cursor: 'pointer',
  },
}));

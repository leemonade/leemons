import { createStyles, pxToRem } from '@bubbles-ui/components';

const PermissionsDataStyles = createStyles((theme) => ({
  root: {},
  header: {
    padding: `${pxToRem(16)} ${pxToRem(24)}`,
    borderBottom: `1px solid ${theme.other.divider.background.color.default}}`,
  },
  title: {
    fontSize: pxToRem(24),
    fontWeight: 500,
    lineHeight: '28px',
    color: '#2F473F',
  },
  contentContainer: {
    padding: pxToRem(24),
  },
  titleItem: {
    fontSize: pxToRem(20),
    fontWeight: 500,
    lineHeight: '24px',
    color: '#2F473F',
  },
  titleTabs: {
    fontSize: pxToRem(20),
    fontWeight: 500,
    lineHeight: '24px',
    color: '#2F473F',
    marginTop: pxToRem(16),
  },
  tab: {
    '& button[aria-selected="true"]': {
      borderBottomColor: '#B4E600 !important',
    },
    '& button:hover': {
      backgroundColor: '#F1FFBD !important',
      borderBottomColor: '#F1FFBD   !important',
    },
    '& button[aria-selected="true"]:hover': {
      backgroundColor: '#F1FFBD !important',
      borderBottomColor: '#B4E600 !important',
    },
  },
  alertContainer: {
    marginTop: pxToRem(16),
    marginBottom: pxToRem(32),
  },
  footer: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
    left: 0,
    display: 'flex',
    justifyContent: 'space-between',
    padding: `${pxToRem(12)} ${pxToRem(24)}`,
    borderTop: `1px solid ${theme.other.divider.background.color.default}`,
  },
  footerButtons: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
  },
}));

export default PermissionsDataStyles;
export { PermissionsDataStyles };

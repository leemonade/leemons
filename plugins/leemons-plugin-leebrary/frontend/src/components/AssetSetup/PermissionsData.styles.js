import { createStyles, pxToRem } from '@bubbles-ui/components';

const PermissionsDataStyles = createStyles((theme) => ({
  root: {},
  contentContainer: {
    padding: pxToRem(24),
  },
  titleItem: {
    fontSize: pxToRem(20),
    fontWeight: 500,
    lineHeight: '24px',
    color: '#2F473F',
    paddingTop: pxToRem(16),
  },
  titleTabs: {
    fontSize: pxToRem(20),
    fontWeight: 500,
    lineHeight: '24px',
    color: '#2F473F',
    marginTop: pxToRem(16),
  },
  libraryItem: {
    width: '55%',
    paddingBlock: 4,
    paddingInline: 0,
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
    marginTop: pxToRem(32),
    marginBottom: pxToRem(16),
  },
  footer: {
    position: 'absolute',
    height: 72,
    width: '100%',
    bottom: 0,
    left: 0,
    display: 'flex',
    justifyContent: 'space-between',
    padding: `${pxToRem(16)} ${pxToRem(24)}`,
    borderTop: `1px solid ${theme.other.divider.background.color.default}`,
    backgroundColor: '#FFFFFF',
    zIndex: 10,
  },
  footerButtons: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
  },
}));

export default PermissionsDataStyles;
export { PermissionsDataStyles };

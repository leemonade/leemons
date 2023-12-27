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
}));

export default PermissionsDataStyles;
export { PermissionsDataStyles };

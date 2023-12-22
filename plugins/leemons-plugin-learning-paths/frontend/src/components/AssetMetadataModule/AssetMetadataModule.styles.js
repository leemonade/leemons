import { createStyles, pxToRem } from '@bubbles-ui/components';

const AssetMetadataModuleStyles = createStyles((theme) => ({
  root: {},
  typologyContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: pxToRem(8),
  },
  title: {
    color: theme.other.global.content.color.text.default,
    fontSize: pxToRem(14),
    fontStyle: 'normal',
    fontWeight: 400,
    lineHeight: '20px',
  },
  value: {
    fontSize: pxToRem(14),
    fontStyle: 'normal',
    fontWeight: 600,
    lineHeight: '20px',
  },
  box: {
    marginTop: pxToRem(8),
  },
  tableWrapper: {
    display: 'flex',
    marginTop: pxToRem(8),
  },
  tableRow: {
    display: 'flex',
    alignItems: 'center',
    gap: pxToRem(8),
    width: '100%',
    height: pxToRem(40),
    borderBottom: `1px solid ${theme.other.table.border.color.default}`,
  },
  tableRowMap: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    // flexWrap: 'nowrap',
    height: pxToRem(40),
  },
  tableColumnName: {
    color: theme.other.table.content.color.default,
    width: '50%',
    fontSize: pxToRem(14),
    fontStyle: 'normal',
    fontWeight: 500,
    lineHeight: '20px',
    paddingLeft: pxToRem(8),
  },
  tableColumnType: {
    color: theme.other.table.content.color.default,
    width: '50%',
    fontSize: pxToRem(14),
    fontStyle: 'normal',
    fontWeight: 500,
    lineHeight: '20px',
    paddingLeft: pxToRem(8),
  },
  tableColumActivity: {
    width: '50%',
    marginLeft: pxToRem(8),
    paddingRight: pxToRem(8),
  },
  tableTypology: {
    display: 'flex',
    alignItems: 'center',
    gap: pxToRem(8),
  },
}));

export default AssetMetadataModuleStyles;
export { AssetMetadataModuleStyles };

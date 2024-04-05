import { createStyles, pxToRem } from '@bubbles-ui/components';

const AssetMetadataContentCreatorStyles = createStyles((theme) => ({
  root: {},
  typologyContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: pxToRem(8),
  },
  typologyName: {
    fontSize: pxToRem(14),
    fontStyle: 'normal',
    fontWeight: 600,
    lineHeight: '20px',
    marginBottom: pxToRem(4),
  },
  title: {
    color: theme.other.global.content.color.text.default,
    fontSize: pxToRem(14),
    fontStyle: 'normal',
    fontWeight: 400,
    lineHeight: '20px',
  },
  h1Header: {
    display: 'block',
    padding: `${pxToRem(4)} 0px ${pxToRem(2)} 0px}`,
  },
  openIcon: {
    position: 'absolute',
    marginLeft: pxToRem(4),
    top: pxToRem(1),
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
}));

export default AssetMetadataContentCreatorStyles;
export { AssetMetadataContentCreatorStyles };

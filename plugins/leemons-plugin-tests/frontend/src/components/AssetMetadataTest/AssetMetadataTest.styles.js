import { createStyles, pxToRem } from '@bubbles-ui/components';

const AssetMetadataTestStyles = createStyles((theme) => ({
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
  link: {
    position: 'relative',
    color: theme.other.link.content.color.default,
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

export default AssetMetadataTestStyles;
export { AssetMetadataTestStyles };

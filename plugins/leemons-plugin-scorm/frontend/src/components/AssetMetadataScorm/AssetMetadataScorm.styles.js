import { createStyles, pxToRem } from '@bubbles-ui/components';

const AssetMetadataScormStyles = createStyles((theme) => ({
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

export default AssetMetadataScormStyles;
export { AssetMetadataScormStyles };

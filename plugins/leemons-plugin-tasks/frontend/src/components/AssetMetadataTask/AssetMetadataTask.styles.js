import { createStyles, pxToRem } from '@bubbles-ui/components';

const AssetMetadataTaskStyles = createStyles((theme) => ({
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
  valueDescription: {
    display: 'block',
    fontSize: pxToRem(14),
    fontStyle: 'normal',
    fontWeight: 600,
    lineHeight: '20px',
    marginTop: pxToRem(8),
    marginBottom: pxToRem(4),
  },
  box: {
    marginTop: pxToRem(8),
  },
}));

export default AssetMetadataTaskStyles;
export { AssetMetadataTaskStyles };

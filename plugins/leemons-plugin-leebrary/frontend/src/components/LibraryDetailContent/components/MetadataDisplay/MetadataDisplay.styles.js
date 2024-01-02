import { createStyles, pxToRem } from '@bubbles-ui/components';

const MetadataDisplayStyles = createStyles((theme) => ({
  root: {},
  fileIconContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: pxToRem(8),
  },
  fileLabel: {
    color: theme.other.global.content.color.text.default,
    fontSize: pxToRem(14),
    fontWeight: 600,
    lineHeight: '20px',
  },
  box: {
    marginTop: pxToRem(8),
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
  url: {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
}));

export default MetadataDisplayStyles;
export { MetadataDisplayStyles };

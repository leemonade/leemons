import { createStyles, pxToRem } from '@bubbles-ui/components';

const DashboardCardCoverStyles = createStyles((theme) => {
  const { ChipModule } = theme.other;
  return {
    root: {
      width: '100%',
      height: pxToRem(144),
      minHeight: pxToRem(144),
      position: 'relative',
      overflow: 'hidden',
      borderRadius: '4px 4px 0px 0px',
    },
    orderLabel: {
      position: 'absolute',
      left: 0,
      bottom: pxToRem(8),
      backgroundColor: ChipModule.background.color.default,
      borderRadius: '0px 4px 4px 0px',
      padding: `${pxToRem(8)} ${pxToRem(12)}`,
    },
  };
});

export default DashboardCardCoverStyles;
export { DashboardCardCoverStyles };

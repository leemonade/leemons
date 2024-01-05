import { createStyles, pxToRem } from '@bubbles-ui/components';

const DashboardCardCoverStyles = createStyles((theme, { moduleColor }) => {
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
    color: {
      width: '100%',
      height: pxToRem(4),
      backgroundColor: moduleColor || 'transparent',
      transition: 'all 0.2s ease-out',
      borderRadius: '2px 0 0 0',
    },
  };
});

export default DashboardCardCoverStyles;
export { DashboardCardCoverStyles };

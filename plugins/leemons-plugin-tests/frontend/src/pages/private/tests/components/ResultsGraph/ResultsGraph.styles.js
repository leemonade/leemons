import { createStyles } from '@bubbles-ui/components';

const useResultsGraphStyles = createStyles((theme, { graphHeight }) => {
  const questionStatusColors = {
    ok: theme.other.core.color.success['300'],
    ko: theme.other.core.color.danger['300'],
    omitted: theme.other.core.color.neutral['300'],
  };

  return {
    container: {
      gap: 24,
      marginBottom: 8,
    },
    headerContainer: {
      justifyContent: 'space-between',
      width: '100%',
    },

    // GRAPH
    graphContainer: {
      padding: 16,
    },
    yAxisValues: {
      width: 20,
      position: 'relative',
      height: graphHeight,
    },
    gridContainer: {
      width: '100%',
      position: 'relative',
      height: graphHeight,
    },
    gridLines: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      borderTop: `1px dashed ${theme.other.core.color.neutral['200']}`,
      zIndex: 0,
    },
    grid: {
      position: 'relative',
      zIndex: 1,
    },
    barContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'start',
      minWidth: 100,
      gap: 8,
    },
    bar: {
      width: 50,
      height: graphHeight,
      position: 'relative',
    },
    barSection: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
    },
    barLegend: {
      textAlign: 'center',
      width: 90,
    },

    // LEGEND
    legendContainer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 16,
    },
    legendLabelContainer: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    legendSquare: {
      width: 12,
      height: 12,
    },
    okBackground: {
      backgroundColor: questionStatusColors.ok,
    },
    koBackground: {
      backgroundColor: questionStatusColors.ko,
    },
    omittedBackground: {
      backgroundColor: questionStatusColors.omitted,
    },
  };
});

export default useResultsGraphStyles;

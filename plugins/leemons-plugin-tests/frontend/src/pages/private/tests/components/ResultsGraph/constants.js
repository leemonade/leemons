import { useTheme } from '@bubbles-ui/components';

const FONT_FAMILY = 'Albert Sans';
export default function useGraphConstants() {
  const theme = useTheme();

  const QUESTION_STATUS_COLORS = {
    ok: theme.other.core.color.success['300'],
    ko: theme.other.core.color.danger['300'],
    omitted: theme.other.core.color.neutral['300'],
  };

  const LEGEND_MARK_SIZE = {
    width: 16,
    height: 16,
  };

  const THEME = {
    labels: {
      text: {
        fontSize: 14,
        fontFamily: FONT_FAMILY,
      },
    },
    axis: {
      ticks: {
        text: {
          fill: '#70707B',
          fontSize: 12,
          fontFamily: FONT_FAMILY,
        },
      },
      legend: {
        text: {
          fill: '#70707B',
          fontSize: 12,
          fontFamily: FONT_FAMILY,
        },
      },
    },
    grid: {
      line: {
        stroke: '#F0F0F3',
        strokeWidth: 1,
      },
    },
  };

  const LABEL_COLOR = theme.primaryColor;

  return {
    QUESTION_STATUS_COLORS,
    LEGEND_MARK_SIZE,
    THEME,
    LABEL_COLOR,
  };
}

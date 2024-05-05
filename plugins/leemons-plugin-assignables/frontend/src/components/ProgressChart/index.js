import React from 'react';
import PropTypes from 'prop-types';
import { Box, Stack, Text } from '@bubbles-ui/components';
import { ResponsiveBar } from '@nivo/bar';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@assignables/helpers/prefixPN';
import { Tooltip } from './components/Tooltip';
import { AverageMarker } from './components/AverageMarker';
import { PassMarker } from './components/PassMarker';

const COLORS = {
  APPROVED: '#76CEC1',
  IN_PROGRESS: '#FFAD5B',
  NOT_APPROVED: '#FF7366',
  AVERAGE: '#BA73B4',
  PASS: '#A3A3A3',
};

const LEGEND_MARK_SIZE = {
  width: 16,
  height: 16,
};

const THEME = {
  labels: {
    text: {
      fontSize: 14,
      fontFamily: 'Albert Sans',
    },
  },
  axis: {
    ticks: {
      text: {
        fill: '#70707B',
        fontSize: 12,
        fontFamily: 'Albert Sans',
      },
    },
  },
  grid: {
    line: {
      stroke: '#E4E4E7',
      strokeWidth: 1,
    },
  },
};

function formatLabel(label, maxChars) {
  if (maxChars === 0) return label;
  if (label.startsWith('skip:')) return '';

  if (label.length > maxChars) {
    return `${label.substring(0, maxChars - 3)}...`;
  }
  return label;
}

function getBarColor(bar, barColorFromLabel) {
  if (bar.id === 'diff') return 'rgba(207, 207, 214, 0.3)';
  let value = bar.value ?? 0;
  if (barColorFromLabel) {
    value = Number(bar.indexValue);
  }

  if (value <= 4) return COLORS.NOT_APPROVED;
  if (value <= 6) return COLORS.IN_PROGRESS;
  return COLORS.APPROVED;
}

function getLabelColor(bar) {
  if (bar.data.id === 'diff' || bar.data.indexValue.startsWith('skip:'))
    return 'rgba(207, 207, 214, 0)';
  return '#1A1A1E';
}

function ProgressChart({
  data,
  maxValue,
  passValue,
  hideMarkers,
  barColorFromLabel,
  tooltip,
  hideTooltip,
  hideLabels,
  height = 500,
  ariaLabel = 'Learning Analytics',
}) {
  const [t] = useTranslateLoader(prefixPN('progress'));
  const chartRef = React.useRef();
  const [initialized, setInitialized] = React.useState(false);

  React.useEffect(() => {
    setTimeout(() => {
      // Force redraw in order to recalculate maxChars
      setInitialized(true);
    }, 500);
  }, []);

  const max = React.useMemo(
    () => maxValue || Math.max(...data.map((d) => d.value)),
    [data, maxValue]
  );

  const dataProcessed = React.useMemo(() => {
    const result = [...data];
    if (result.length < 4) {
      // Fill the missing data with 0s
      const missingData = Array.from({ length: 4 - result.length }, (v, k) => ({
        label: `skip:${k}`,
        value: 0,
        skip: true,
      }));
      result.push(...missingData);
    }
    return result.map((d) => ({ ...d, diff: max - (d.value ?? 0) }));
  }, [data, max]);

  const maxChars = React.useMemo(() => {
    if (!chartRef.current) return 0;

    const totalBars = dataProcessed.length;
    const totalWidth = chartRef.current.getBoundingClientRect().width;
    const averageLetterWidth = 6.5;

    return Math.floor(totalWidth / totalBars / averageLetterWidth);
  }, [dataProcessed, initialized, chartRef.current]);

  console.log('hideMarkers', hideMarkers);

  const markers = React.useMemo(() => {
    if (hideMarkers) return [];
    return [AverageMarker, (props) => <PassMarker {...props} passValue={passValue} />];
  }, [hideMarkers, passValue]);

  return (
    <Stack spacing={4} direction="column" sx={{ width: '100%' }}>
      <Box ref={chartRef} style={{ height }}>
        <ResponsiveBar
          data={dataProcessed}
          keys={['value', 'diff']}
          indexBy="label"
          margin={{ top: 10, right: 0, bottom: 40, left: 30 }}
          padding={0.1}
          layers={['grid', 'axes', 'bars', ...markers]}
          maxValue={maxValue}
          valueScale={{ type: 'linear', max }}
          indexScale={{ type: 'band', round: true }}
          colors={(bar) => getBarColor(bar, barColorFromLabel)}
          tooltip={hideTooltip ? React.Fragment : tooltip || Tooltip}
          theme={THEME}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 0,
            tickPadding: 10,
            tickRotation: 0,
            legendOffset: 0,
            format: (label) => formatLabel(label, maxChars),
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 12,
            tickRotation: 0,
            legendOffset: 0,
            truncateTickAt: 0,
          }}
          labelTextColor={hideLabels ? 'rgba(0, 0, 0, 0)' : getLabelColor}
          role="application"
          ariaLabel={ariaLabel}
        />
      </Box>

      <Stack spacing={6} alignItems="center">
        <Stack spacing={2} alignItems="center">
          <Box sx={{ backgroundColor: COLORS.APPROVED, ...LEGEND_MARK_SIZE }} />
          <Text size="xs" color="primary">
            {t('approved')}
          </Text>
        </Stack>
        <Stack spacing={2} alignItems="center">
          <Box sx={{ backgroundColor: COLORS.IN_PROGRESS, ...LEGEND_MARK_SIZE }} />
          <Text size="xs" color="primary">
            {t('inProgress')}
          </Text>
        </Stack>
        <Stack spacing={2} alignItems="center">
          <Box sx={{ backgroundColor: COLORS.NOT_APPROVED, ...LEGEND_MARK_SIZE }} />
          <Text size="xs" color="primary">
            {t('notApproved')}
          </Text>
        </Stack>
        {!hideMarkers && (
          <>
            <Stack spacing={2} alignItems="center">
              <Box sx={{ borderTop: `4px solid ${COLORS.AVERAGE}`, width: 24, height: 1 }} />
              <Text size="xs" color="primary">
                {t('average')}
              </Text>
            </Stack>
            <Stack spacing={2} alignItems="center">
              <Box sx={{ borderTop: `2px dashed ${COLORS.PASS}`, width: 24, height: 1 }} />
              <Text size="xs" color="primary">
                {t('pass')}
              </Text>
            </Stack>
          </>
        )}
      </Stack>
    </Stack>
  );
}

ProgressChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
  maxValue: PropTypes.number,
  passValue: PropTypes.number,
  height: PropTypes.number,
  ariaLabel: PropTypes.string,
  hideMarkers: PropTypes.bool,
  barColorFromLabel: PropTypes.bool,
  tooltip: PropTypes.any,
  hideTooltip: PropTypes.bool,
  hideLabels: PropTypes.bool,
};

export { ProgressChart };

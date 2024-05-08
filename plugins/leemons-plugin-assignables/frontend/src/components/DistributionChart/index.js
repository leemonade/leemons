import React from 'react';
import PropTypes from 'prop-types';
import { Box, Stack, Text, useDebouncedValue } from '@bubbles-ui/components';
import { ResponsiveBar } from '@nivo/bar';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@assignables/helpers/prefixPN';
import { isNil, toUpper } from 'lodash';
import { COLORS, THEME, LEGEND_MARK_SIZE, getBarColor, getLabelColor } from '../ProgressChart';
import { Bar } from './components/Bar';
import { PassMarker } from './components/PassMarker';
import { AverageMarker } from './components/AverageMarker';

function DistributionChart({
  data,
  maxValue,
  minimumScale,
  passValue,
  tooltip,
  hideTooltip,
  legendLeft,
  legendBottom,
  hideMarkers,
  height = 500,
  ariaLabel = 'Learning Analytics',
}) {
  const [t] = useTranslateLoader(prefixPN('progress'));
  const chartRef = React.useRef();

  const [barWidth, setBarWidth] = React.useState(0);
  const [debouncedBarWidth] = useDebouncedValue(barWidth, 25);

  const max = React.useMemo(
    () => maxValue || Math.max(...data.map((d) => d.value)),
    [data, maxValue]
  );

  const dataProcessed = React.useMemo(() => {
    const result = data.sort((a, b) => Number(a.label) - Number(b.label));
    if (result.length < 4) {
      // Fill the missing data with 0s
      const missingData = Array.from({ length: 4 - result.length }, (v, k) => ({
        label: `skip:${k}`,
        value: 0,
        skip: true,
      }));
      result.push(...missingData);
    }
    return result.map((d) => {
      const value = Number(d.label) > minimumScale ? d.value : 0;
      return {
        ...d,
        value,
        diff: max - (value ?? 0),
      };
    });
  }, [data, max, minimumScale]);

  const markers = React.useMemo(() => {
    if (hideMarkers) return [];
    return [
      (props) => <AverageMarker {...props} barWidth={debouncedBarWidth} />,
      (props) => <PassMarker {...props} barWidth={debouncedBarWidth} passValue={passValue} />,
    ];
  }, [hideMarkers, passValue, debouncedBarWidth]);

  const tickValues = React.useMemo(() => Array.from({ length: max + 1 }, (_, i) => i), [max]);

  return (
    <Stack spacing={4} direction="column" sx={{ width: '100%' }}>
      <Box ref={chartRef} style={{ height }}>
        <ResponsiveBar
          data={dataProcessed}
          keys={['value', 'diff']}
          indexBy="label"
          margin={{
            top: 10,
            right: 0,
            bottom: legendBottom ? 60 : 40,
            left: legendLeft ? 60 : 30,
          }}
          padding={0.1}
          layers={['grid', 'axes', 'bars', ...markers]}
          maxValue={maxValue}
          valueScale={{ type: 'linear', max }}
          indexScale={{ type: 'band', round: true }}
          colors={(bar) => getBarColor(bar, true)}
          tooltip={hideTooltip ? React.Fragment : tooltip || React.Fragment}
          theme={THEME}
          animate={false}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            legend: toUpper(legendBottom),
            legendPosition: 'middle',
            legendOffset: 40,
            tickSize: 0,
            tickPadding: 10,
            tickRotation: 0,
          }}
          axisLeft={{
            legend: toUpper(legendLeft),
            legendPosition: 'middle',
            legendOffset: -50,
            tickSize: 5,
            tickPadding: 12,
            tickRotation: 0,
            truncateTickAt: 0,
            tickValues,
          }}
          barComponent={(barProps) => {
            if (debouncedBarWidth !== barProps.bar.width) {
              setBarWidth(barProps.bar.width);
            }

            return <Bar {...barProps} />;
          }}
          gridYValues={tickValues}
          labelTextColor={getLabelColor}
          role="application"
          ariaLabel={ariaLabel}
        />
      </Box>
      <Stack spacing={6} alignItems="center" justifyContent="center">
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

DistributionChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
  maxValue: PropTypes.number,
  minimumScale: PropTypes.number,
  passValue: PropTypes.number,
  height: PropTypes.number,
  ariaLabel: PropTypes.string,
  tooltip: PropTypes.any,
  hideTooltip: PropTypes.bool,
  legendLeft: PropTypes.string,
  legendBottom: PropTypes.string,
  hideMarkers: PropTypes.bool,
};

export { DistributionChart };

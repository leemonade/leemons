import { useCallback, useMemo, useRef, useState } from 'react';

import { useLevelsOfDifficulty } from '@assignables/components/LevelsOfDifficulty';
import { Box, Stack, Text, useDebouncedValue, Loader } from '@bubbles-ui/components';
import { ResponsiveBar } from '@nivo/bar';
import { toUpper, camelCase } from 'lodash';
import PropTypes from 'prop-types';

import { Bar } from './Bar';
import useGraphConstants from './constants';

import { GRAPH_TYPES } from '.';

function GraphView({
  legendLeft,
  legendBottom,
  height,
  xAxisLabelsMaxChars = 30,
  ariaLabel = 'Test Details',
  questions,
  questionResponses,
  graphType,
  t,
}) {
  const [barWidth, setBarWidth] = useState(0);
  const [debouncedBarWidth] = useDebouncedValue(barWidth, 10);
  const levels = useLevelsOfDifficulty(true);
  const chartRef = useRef();
  const { QUESTION_STATUS_COLORS, LEGEND_MARK_SIZE, THEME, LABEL_COLOR } = useGraphConstants();

  const getBarLabel = useCallback(
    (key) => {
      let label = key;
      if (graphType === GRAPH_TYPES.level) {
        label = levels?.find((level) => level.value === key)?.label || key;
      }

      if (graphType === GRAPH_TYPES.type) {
        label = t(`questionTypes.${camelCase(key)}`) || key;
      }

      if (label.length > xAxisLabelsMaxChars) {
        return `${label.substring(0, xAxisLabelsMaxChars - 3)}...`;
      }
      return label;
    },
    [levels, graphType, t, xAxisLabelsMaxChars]
  );

  const orderData = useCallback(
    (data) => {
      if (graphType === GRAPH_TYPES.level) {
        const itemsWithoutLevel = [];
        const itemsWithLevel = [];
        data.forEach((item) => {
          const order = levels?.findIndex((level) => level.label === item.label);

          if (order === -1) {
            itemsWithoutLevel.push(item);
          } else {
            itemsWithLevel.push({ ...item, order });
          }
        });

        return [...itemsWithLevel.sort((a, b) => a.order - b.order), ...itemsWithoutLevel];
      }
      if (graphType === GRAPH_TYPES.category) {
        return [
          ...data
            .filter((item) => item.label !== t('undefined'))
            .sort((a, b) => a.label.localeCompare(b.label)),
          ...data.filter((item) => item.label === t('undefined')),
        ];
      }

      return data.sort((a, b) => a.label.localeCompare(b.label));
    },
    [levels, graphType, t]
  );

  const data = useMemo(() => {
    const questionsByGraphType = questions.reduce((acc, question) => {
      let groupKey = '';
      if (graphType === GRAPH_TYPES.type) {
        groupKey = question.type;
      } else if (graphType === GRAPH_TYPES.level) {
        groupKey = question.level || t('undefined');
      } else if (graphType === GRAPH_TYPES.category) {
        groupKey = question.category?.category || t('undefined');
      }
      if (!acc[groupKey]) {
        acc[groupKey] = { ok: 0, ko: 0, omitted: 0 };
      }

      const response = questionResponses[question.id];
      if (!response?.status) {
        acc[groupKey].omitted++;
      } else if (response.status === 'ok') {
        acc[groupKey].ok++;
      } else {
        acc[groupKey].ko++;
      }

      return acc;
    }, {});

    const processedData = Object.entries(questionsByGraphType).map(([key, stats]) => ({
      label: getBarLabel(key),
      ok: stats.ok,
      ko: stats.ko,
      omitted: stats.omitted,
    }));

    return orderData(processedData);
  }, [questions, questionResponses, graphType, t, getBarLabel, orderData]);

  const maxQuestions = useMemo(() => {
    return Math.max(...data.map((item) => item.ok + item.ko + item.omitted));
  }, [data]);

  const yAxisValues = useMemo(() => {
    return Array.from({ length: maxQuestions + 1 }, (_, i) => i);
  }, [maxQuestions]);

  if (!levels || !t)
    return (
      <Stack fullWidth sx={{ height }}>
        <Loader padded />
      </Stack>
    );

  return (
    <Stack spacing={4} direction="column" sx={{ width: '100%' }}>
      <Box ref={chartRef} style={{ height }}>
        <ResponsiveBar
          key={`bar-${debouncedBarWidth}`} // needed for correct bar width recalcuation (known issue of nivo)
          data={data}
          keys={['ok', 'ko', 'omitted']}
          indexBy="label"
          margin={{
            top: 10,
            right: 0,
            bottom: legendBottom ? 60 : 40,
            left: legendLeft ? 60 : 30,
          }}
          padding={0.1}
          layers={['grid', 'axes', 'bars']}
          maxValue={maxQuestions}
          valueScale={{ type: 'linear', max: maxQuestions }}
          indexScale={{ type: 'band', round: true }}
          colors={({ id }) => QUESTION_STATUS_COLORS[id]}
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
            tickValues: yAxisValues,
          }}
          barComponent={(barProps) => {
            if (debouncedBarWidth !== barProps.bar.width) {
              setBarWidth(barProps.bar.width);
            }
            return <Bar {...barProps} />;
          }}
          enableGridY={true}
          labelTextColor={LABEL_COLOR}
          role="application"
          ariaLabel={ariaLabel}
        />
      </Box>
      <Stack spacing={6} alignItems="center" justifyContent="center">
        <Stack spacing={2} alignItems="center">
          <Box sx={{ backgroundColor: QUESTION_STATUS_COLORS.ok, ...LEGEND_MARK_SIZE }} />
          <Text size="xs" color="primary">
            {t('questionStatus.ok')}
          </Text>
        </Stack>
        <Stack spacing={2} alignItems="center">
          <Box sx={{ backgroundColor: QUESTION_STATUS_COLORS.ko, ...LEGEND_MARK_SIZE }} />
          <Text size="xs" color="primary">
            {t('questionStatus.ko')}
          </Text>
        </Stack>
        <Stack spacing={2} alignItems="center">
          <Box sx={{ backgroundColor: QUESTION_STATUS_COLORS.omitted, ...LEGEND_MARK_SIZE }} />
          <Text size="xs" color="primary">
            {t('questionStatus.omitted')}
          </Text>
        </Stack>
      </Stack>
    </Stack>
  );
}

GraphView.propTypes = {
  height: PropTypes.number,
  ariaLabel: PropTypes.string,
  legendLeft: PropTypes.string,
  legendBottom: PropTypes.string,
  xAxisLabelsMaxChars: PropTypes.number,
  graphType: PropTypes.string,
  t: PropTypes.func,
  questions: PropTypes.arrayOf(PropTypes.object),
  questionResponses: PropTypes.object,
};

export default GraphView;

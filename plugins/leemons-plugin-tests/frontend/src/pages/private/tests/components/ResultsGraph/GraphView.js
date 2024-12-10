import { useMemo, useCallback } from 'react';

import { useLevelsOfDifficulty } from '@assignables/components/LevelsOfDifficulty';
import { Box, Stack, Grid, Col, Text, ContextContainer, TextClamp } from '@bubbles-ui/components';
import { camelCase } from 'lodash';
import PropTypes from 'prop-types';

import { GRAPH_TYPES } from '.';

const BAR_LABELS_OFFSET = 34;

const GraphView = ({ questions, questionResponses, graphType, t, classes, cx }) => {
  const levels = useLevelsOfDifficulty();
  const labels = useMemo(
    () => ({
      ok: t('questionStatus.ok'),
      ko: t('questionStatus.ko'),
      omitted: t('questionStatus.omitted'),
    }),
    [t]
  );

  const getBarLabel = useCallback(
    (key) => {
      if (graphType === GRAPH_TYPES.level) {
        return levels.find((level) => level.value === key)?.label || key;
      }

      if (graphType === GRAPH_TYPES.type) {
        return t(`questionTypes.${camelCase(key)}`) || key;
      }

      return key;
    },
    [levels, graphType, t]
  );

  const orderData = useCallback(
    (data) => {
      if (graphType === 'level') {
        const itemsWithoutLevel = [];
        const itemsWithLevel = [];
        data.forEach((item) => {
          const order = levels.findIndex((level) => level.label === item.label);

          if (order === -1) {
            itemsWithoutLevel.push(item);
          } else {
            itemsWithLevel.push({ ...item, order });
          }
        });

        return [...itemsWithLevel.sort((a, b) => a.order - b.order), ...itemsWithoutLevel];
      }
      if (graphType === 'category') {
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
        acc[groupKey] = { total: 0, ok: 0, ko: 0, omitted: 0 };
      }
      acc[groupKey].total++;

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
      total: stats.total,
      sections: [
        { type: 'ok', count: stats.ok },
        { type: 'ko', count: stats.ko },
        { type: 'omitted', count: stats.omitted },
      ],
    }));

    return orderData(processedData);
  }, [questions, questionResponses, graphType, t, getBarLabel, orderData]);

  const maxQuestions = useMemo(() => {
    return Math.max(...data.map((item) => item.total));
  }, [data]);

  const yAxisValues = useMemo(() => {
    return Array.from({ length: maxQuestions + 1 }, (_, i) => i);
  }, [maxQuestions]);

  return (
    <ContextContainer className={classes.graphContainer}>
      {/* Graph */}
      <Stack>
        {/* Y axis values */}
        <Box className={classes.yAxisValues}>
          {yAxisValues.map((value) => (
            <Text
              key={value}
              size="xs"
              color="primary"
              sx={{
                position: 'absolute',
                left: 0,
                bottom: `${(value / maxQuestions) * 100}%`,
                transform: 'translateY(50%)',
              }}
            >
              {value}
            </Text>
          ))}
        </Box>

        {/* Background and bars */}
        <Box className={classes.gridContainer}>
          {/* Horizontal grid lines */}
          {yAxisValues.map((value) => (
            <Box
              key={value}
              className={classes.gridLines}
              sx={{ bottom: `${(value / maxQuestions) * 100}%` }}
            />
          ))}

          {/* Grid */}
          <Grid columns={data.length} gutter="md" className={classes.grid}>
            {data.map((item) => (
              <Col key={item.label} span={1}>
                <Stack className={classes.barContainer}>
                  {/* Bar */}
                  <Box className={classes.bar}>
                    {item.sections.map((section, index, array) => {
                      const previousHeight = array
                        .slice(0, index)
                        .reduce((sum, s) => sum + (s.count / maxQuestions) * 100, 0);

                      const height = (section.count / maxQuestions) * 100;

                      return (
                        <Box
                          key={section.type}
                          className={cx(classes.barSection, classes[`${section.type}Background`])}
                          sx={{
                            bottom: `${previousHeight}%`,
                            height: `${height}%`,
                          }}
                        />
                      );
                    })}
                  </Box>

                  {/* Labels below the bar */}
                  <Box className={classes.barLegend} sx={{ height: BAR_LABELS_OFFSET }}>
                    <TextClamp lines={2} withTooltip>
                      <Text role="productive" color="primary" strong>
                        {item.label}
                      </Text>
                    </TextClamp>
                  </Box>
                </Stack>
              </Col>
            ))}
          </Grid>
        </Box>
      </Stack>

      <Stack className={classes.legendContainer} sx={{ marginTop: BAR_LABELS_OFFSET }}>
        {Object.entries(labels).map(([key, label]) => (
          <Stack key={key} className={classes.legendLabelContainer}>
            <Box className={cx(classes.legendSquare, classes[`${key}Background`])} />
            <Text size="xs">{label}</Text>
          </Stack>
        ))}
      </Stack>
    </ContextContainer>
  );
};

GraphView.propTypes = {
  questions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      type: PropTypes.string,
      level: PropTypes.string,
      category: PropTypes.string,
    })
  ).isRequired,
  questionResponses: PropTypes.object.isRequired,
  graphType: PropTypes.oneOf(['type', 'level', 'category']).isRequired,
  t: PropTypes.func.isRequired,
  graphHeight: PropTypes.number,
  classes: PropTypes.object,
  cx: PropTypes.func,
};

export default GraphView;

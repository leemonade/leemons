/* eslint-disable no-nested-ternary */
import React from 'react';
import PropTypes from 'prop-types';
import NSPStatisticsStyles from '@feedback/pages/private/feedback/Result/components/NPSStatistics/styles';
import { Badge, Box, Col, Grid, Text } from '@bubbles-ui/components';
import { PointBar } from '@feedback/pages/private/feedback/Result/components/NPSStatistics/PointBar';

function LikertStatistics({ question, responses, t }) {
  const { classes, cx } = NSPStatisticsStyles();
  const columns = [...new Array(question.properties.maxLabels).keys()];

  const averageColor = React.useMemo(() => {
    const mid = (question.properties.maxLabels + 1) / 2;
    if (responses.avg < mid - 0.5) return 'error';
    if (responses.avg > mid + 0.5) return 'success';
    return 'warning';
  }, [question.properties.maxLabels, responses.avg]);

  return (
    <Box className={classes.root}>
      <Box className={classes.header}>
        <Text role="productive" stronger size="sm" color="primary">
          {t('responses', { n: responses.totalValues || 0 })}
        </Text>
        <Badge color="stroke" size="lg" closable={false}>
          <Text size="md" color="primary">
            {t('average')}
          </Text>
          &nbsp;
          <Text size="md" color={averageColor}>
            {responses.avg
              ? responses.avg % 1 === 0
                ? responses.avg
                : responses.avg.toFixed(2)
              : 0}
          </Text>
        </Badge>
      </Box>
      <Box className={classes.content}>
        <Grid gutter={16} columns={question.properties.maxLabels}>
          {columns.map((index) => (
            <Col key={index} span={1}>
              <PointBar
                classes={classes}
                cx={cx}
                percentage={Math.trunc(responses.percentages?.[index] || 0)}
                bottomText={index + 1}
                total={responses.value?.[index] || 0}
                label={question.properties[`likertLabel${index}`]}
                color={
                  index + 1 < (question.properties.maxLabels + 1) / 2
                    ? 'fatic01'
                    : index + 1 > (question.properties.maxLabels + 1) / 2
                    ? 'fatic02'
                    : 'fatic03'
                }
              />
            </Col>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}

LikertStatistics.propTypes = {
  question: PropTypes.any,
  responses: PropTypes.any,
  t: PropTypes.func,
};

export { LikertStatistics };

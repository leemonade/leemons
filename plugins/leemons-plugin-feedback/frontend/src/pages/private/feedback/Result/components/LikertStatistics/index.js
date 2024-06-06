/* eslint-disable no-nested-ternary */
import React from 'react';
import PropTypes from 'prop-types';
import { Badge, Box, Col, Grid, Text } from '@bubbles-ui/components';
import { PointBar } from '@feedback/pages/private/feedback/Result/components/NPSStatistics/PointBar';

import LikertStatisticsStyles from './styles';

function LikertStatistics({ question, responses, t }) {
  const { classes, cx } = LikertStatisticsStyles();
  const columns = [...new Array(question.properties.maxLabels).keys()];

  return (
    <Box className={classes.root}>
      <Box className={classes.header}>
        <Text
          sx={(theme) => ({
            ...theme.other.global.content.typo.heading['xsm--semiBold'],
            fontSize: '12px',
            lineHeight: '16px',
          })}
        >
          {t('responses', { n: responses.totalValues || 0 })}
        </Text>
        <Badge size="xs" closable={false} className={classes.badge}>
          <Text size="xs" className={classes.badgeText}>
            {t('average').toUpperCase()}
          </Text>
          &nbsp;
          <Text size="xs" className={classes.badgeText}>
            {responses.avg
              ? responses.avg % 1 === 0
                ? responses.avg
                : responses.avg.toFixed(2)
              : 0}
          </Text>
        </Badge>
      </Box>
      <Box>
        <Grid gutter={16} columns={question.properties.maxLabels}>
          {columns.map((index) => (
            <Col key={index} span={1}>
              <PointBar
                classes={classes}
                cx={cx}
                percentage={Math.trunc(responses.percentages?.[index] || 0)}
                bottomText={index + 1}
                color="#76CEC1"
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

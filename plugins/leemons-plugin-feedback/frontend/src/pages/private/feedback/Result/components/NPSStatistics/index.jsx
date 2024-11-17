/* eslint-disable no-nested-ternary */
import React from 'react';
import PropTypes from 'prop-types';
import NSPStatisticsStyles from '@feedback/pages/private/feedback/Result/components/NPSStatistics/styles';
import { Box, Col, Grid, Stack, Text } from '@bubbles-ui/components';
import { Header } from '@feedback/pages/private/feedback/Result/components/NPSStatistics/Header';
import { PointBar } from '@feedback/pages/private/feedback/Result/components/NPSStatistics/PointBar';

function NPSStatistics({ question, responses, t }) {
  const { classes, cx } = NSPStatisticsStyles();
  const columns = [...new Array(11).keys()];

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
        <Text
          color="stroke"
          size="lg"
          closable={false}
          sx={(theme) => ({
            ...theme.other.global.content.typo.heading.xsm,
            fontSize: '12px',
            lineHeight: '16px',
          })}
        >
          {t('npsScore', { n: Math.trunc(responses.nps?.points || 0) })}
        </Text>
      </Box>
      <Box className={classes.content}>
        <Grid gutter={8} columns={11}>
          <Col span={7}>
            <Header
              className={classes.sectionDetractors}
              classes={classes}
              cx={cx}
              title={t('npsDetractors')}
              avg={responses.nps?.detractors.avg || 0}
              total={responses.nps?.detractors.number || 0}
            />
          </Col>
          <Col span={2}>
            <Header
              className={classes.sectionPassives}
              classes={classes}
              cx={cx}
              title={t('npsPassives')}
              avg={responses.nps?.passives.avg || 0}
              total={responses.nps?.passives.number || 0}
            />
          </Col>
          <Col span={2}>
            <Header
              className={classes.sectionPromoters}
              classes={classes}
              cx={cx}
              title={t('npsPromoters')}
              avg={responses.nps?.promoters.avg || 0}
              total={responses.nps?.promoters.number || 0}
            />
          </Col>
        </Grid>
        <Box sx={(theme) => ({ marginTop: theme.spacing[2] })}>
          <Grid gutter={8} columns={11}>
            {columns.map((index) => (
              <Col key={index} span={1}>
                <PointBar
                  classes={classes}
                  cx={cx}
                  percentage={Math.trunc(responses.percentages?.[index]) || 0}
                  bottomText={index}
                  total={responses.value?.[index] || 0}
                  color={index < 7 ? '#FF7366' : index > 8 ? '#76CEC1' : '#FFAD5B'}
                />
              </Col>
            ))}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}

NPSStatistics.propTypes = {
  question: PropTypes.any,
  responses: PropTypes.any,
  t: PropTypes.func,
};

export { NPSStatistics };

import React from 'react';
import PropTypes from 'prop-types';
import NSPStatisticsStyles from '@feedback/pages/private/feedback/Result/components/NPSStatistics/styles';
import { Badge, Box, Col, Grid, Text } from '@bubbles-ui/components';
import { Header } from '@feedback/pages/private/feedback/Result/components/NPSStatistics/header';
import { PointBar } from '@feedback/pages/private/feedback/Result/components/NPSStatistics/PointBar';

function NPSStatistics({ question, responses, t }) {
  const { classes, cx } = NSPStatisticsStyles();
  const columns = [...new Array(11).keys()];

  console.log(responses);

  return (
    <Box className={classes.root}>
      <Box className={classes.header}>
        <Text role="productive" stronger size="sm" color="primary">
          {t('responses', { n: responses.totalValues })}
        </Text>
        <Badge color="stroke" size="lg" closable={false}>
          {t('npsScore', { n: responses.nps.points })}
        </Badge>
      </Box>
      <Box className={classes.content}>
        <Grid gutter={8} columns={11}>
          <Col span={7}>
            <Header
              className={classes.sectionDetractors}
              classes={classes}
              cx={cx}
              title={t('npsDetractors')}
              avg={responses.nps.detractors.avg}
              total={responses.nps.detractors.number}
              color="error"
            />
          </Col>
          <Col span={2}>
            <Header
              className={classes.sectionPassives}
              classes={classes}
              cx={cx}
              title={t('npsPassives')}
              avg={responses.nps.passives.avg}
              total={responses.nps.passives.number}
              color="warning"
            />
          </Col>
          <Col span={2}>
            <Header
              className={classes.sectionPromoters}
              classes={classes}
              cx={cx}
              title={t('npsPromoters')}
              avg={responses.nps.promoters.avg}
              total={responses.nps.promoters.number}
              color="success"
            />
          </Col>
        </Grid>
        <Grid gutter={8} columns={11}>
          {columns.map((index) => (
            <Col key={index} span={1}>
              <PointBar classes={classes} cx={cx} percentage={1} />
            </Col>
          ))}
        </Grid>
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

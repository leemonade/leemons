/* eslint-disable no-nested-ternary */
import React from 'react';
import PropTypes from 'prop-types';
import NSPStatisticsStyles from '@feedback/pages/private/feedback/Result/components/NPSStatistics/styles';
import { Badge, Box, Col, Grid, Stack, Text, getFontExpressive } from '@bubbles-ui/components';
import { Header } from '@feedback/pages/private/feedback/Result/components/NPSStatistics/Header';
import { PointBar } from '@feedback/pages/private/feedback/Result/components/NPSStatistics/PointBar';

function NPSStatistics({ question, responses, t }) {
  const { classes, cx } = NSPStatisticsStyles();
  const columns = [...new Array(11).keys()];

  return (
    <Box className={classes.root}>
      <Box className={classes.header}>
        <Text role="productive" stronger size="sm" color="primary">
          {t('responses', { n: responses.totalValues })}
        </Text>
        <Badge
          color="stroke"
          size="lg"
          closable={false}
          labelStyles={{ ...getFontExpressive('16px', 500) }}
        >
          {t('npsScore', { n: Math.trunc(responses.nps.points) })}
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
        <Box sx={(theme) => ({ marginTop: theme.spacing[2] })}>
          <Grid gutter={8} columns={11}>
            {columns.map((index) => (
              <Col key={index} span={1}>
                <PointBar
                  classes={classes}
                  cx={cx}
                  percentage={Math.trunc(responses.percentages[index]) || 0}
                  bottomText={index}
                  total={responses.value[index] || 0}
                  color={index < 7 ? 'fatic01' : index > 8 ? 'fatic02' : 'fatic03'}
                />
              </Col>
            ))}
          </Grid>
        </Box>
        <Stack
          sx={(theme) => ({ marginTop: theme.spacing[4] })}
          fullWidth
          justifyContent="space-between"
        >
          <Text>{question.properties.notLikely}</Text>
          <Text>{question.properties.veryLikely}</Text>
        </Stack>
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

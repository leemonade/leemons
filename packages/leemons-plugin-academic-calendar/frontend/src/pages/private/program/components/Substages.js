import React from 'react';
import PropTypes from 'prop-types';
import { Col, ContextContainer, DatePicker, Grid, Text, Title } from '@bubbles-ui/components';

export default function Substages({
  locale,
  start,
  end,
  disabled,
  value = {},
  program,
  onChange = () => {},
  t,
}) {
  return (
    <ContextContainer sx={(theme) => ({ marginTop: theme.spacing[4] })}>
      <Title order={6}>{t('substagesOrEvaluations')}</Title>
      <Grid columns={100}>
        <Col span={20}>
          <Text role="productive" size="xs" color="primary" strong>
            {t(`frequencies.${program.substagesFrequency}`)}
          </Text>
        </Col>
        <Col span={40}>
          <Text role="productive" size="xs" color="primary" strong>
            {t('init')}
          </Text>
        </Col>
        <Col span={40}>
          <Text role="productive" size="xs" color="primary" strong>
            {t('end')}
          </Text>
        </Col>
      </Grid>
      {program.substages.map((substage) => {
        let maxDate = value[substage.id]?.endDate;
        let minDate = value[substage.id]?.startDate;
        if (!maxDate || maxDate > end) {
          maxDate = end;
        }
        if (!minDate || minDate < start) {
          minDate = start;
        }
        return (
          <Grid key={substage.id} columns={100} align="center">
            <Col span={20}>
              <Text role="productive" size="xs" strong>
                {substage.abbreviation}
              </Text>
            </Col>
            <Col span={40}>
              <DatePicker
                locale={locale}
                disabled={disabled}
                value={value[substage.id]?.startDate}
                minDate={start}
                maxDate={maxDate}
                onChange={(date) => {
                  onChange({
                    ...value,
                    [substage.id]: {
                      ...(value[substage.id] || {}),
                      startDate: date,
                    },
                  });
                }}
                required
              />
            </Col>
            <Col span={40}>
              <DatePicker
                locale={locale}
                disabled={disabled}
                value={value[substage.id]?.endDate}
                minDate={minDate}
                maxDate={end}
                onChange={(date) => {
                  onChange({
                    ...value,
                    [substage.id]: {
                      ...(value[substage.id] || {}),
                      endDate: date,
                    },
                  });
                }}
                required
              />
            </Col>
          </Grid>
        );
      })}
    </ContextContainer>
  );
}

Substages.propTypes = {
  locale: PropTypes.string,
  program: PropTypes.any,
  value: PropTypes.any,
  onChange: PropTypes.func,
  t: PropTypes.func,
  disabled: PropTypes.bool,
  start: PropTypes.any,
  end: PropTypes.any,
};

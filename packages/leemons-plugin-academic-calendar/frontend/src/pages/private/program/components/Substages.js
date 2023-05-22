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
      {program.substages.map((substage, index) => {
        let maxDate = value[substage.id]?.endDate;
        let minDate = value[substage.id]?.startDate;
        let initMinDate = start;
        let endMaxDate = end;
        let _disabled = disabled;
        if (!maxDate || maxDate > end) {
          maxDate = end;
        }
        if (!minDate || minDate < start) {
          minDate = start;
        }
        if (index > 0) {
          _disabled = !value[program.substages[index - 1].id]?.endDate;
          if (!_disabled) {
            initMinDate = value[program.substages[index - 1].id].endDate;
          }
        }
        if (index + 1 < program.substages.length) {
          const s = value[program.substages[index + 1].id]?.startDate;
          if (s) {
            endMaxDate = s;
          }
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
                disabled={_disabled}
                value={value[substage.id]?.startDate}
                minDate={initMinDate}
                maxDate={maxDate}
                onChange={(date) => {
                  if (!date) {
                    onChange({
                      ...value,
                      [substage.id]: {
                        ...(value[substage.id] || {}),
                        startDate: date,
                        endDate: date,
                      },
                    });
                  } else {
                    onChange({
                      ...value,
                      [substage.id]: {
                        ...(value[substage.id] || {}),
                        startDate: date,
                      },
                    });
                  }
                }}
                required
              />
            </Col>
            <Col span={40}>
              <DatePicker
                locale={locale}
                clearable={false}
                disabled={_disabled || !value[substage.id]?.startDate}
                value={value[substage.id]?.endDate || value[substage.id]?.startDate}
                minDate={minDate}
                maxDate={endMaxDate}
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

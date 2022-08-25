/* eslint-disable no-param-reassign */
import React from 'react';
import PropTypes from 'prop-types';
import {
  ActionButton,
  Box,
  Button,
  Col,
  ContextContainer,
  Grid,
  Text,
  Title,
} from '@bubbles-ui/components';
import { CalendarNewEventModal } from '@bubbles-ui/leemons';
import { DeleteBinIcon, EditWriteIcon } from '@bubbles-ui/icons/solid';
import { AddCircleIcon } from '@bubbles-ui/icons/outline';
import { useStore } from '@common';
import ColorBall from '@academic-calendar/components/ColorBall';
import { useLayout } from '@layout/context';

export default function OtherEvents({
  locale,
  start,
  end,
  disabled,
  value = [],
  onChange = () => {},
  t,
}) {
  const [store, render] = useStore();
  const { openDeleteConfirmationModal } = useLayout();

  const eventModalProps = React.useMemo(
    () => ({
      labels: {
        periodName: t('eventModal.labels.periodName'),
        schoolDays: t('eventModal.labels.schoolDays'),
        nonSchoolDays: t('eventModal.labels.nonSchoolDays'),
        withoutOrdinaryDays: t('eventModal.labels.withoutOrdinaryDays'),
        startDate: t('eventModal.labels.startDate'),
        endDate: t('eventModal.labels.endDate'),
        color: t('eventModal.labels.color'),
        add: t('eventModal.labels.add'),
      },
      placeholders: {
        periodName: t('eventModal.labels.periodName'),
        startDate: t('eventModal.labels.startDate'),
        endDate: t('eventModal.labels.endDate'),
        color: t('eventModal.labels.color'),
      },
      errorMessages: {
        periodName: t('fieldRequired'),
        dayType: t('fieldRequired'),
        startDate: t('fieldRequired'),
        endDate: t('fieldRequired'),
        color: t('fieldRequired'),
      },
    }),
    []
  );

  function removeIndex(index) {
    openDeleteConfirmationModal({
      onConfirm: () => {
        onChange(value.filter((_, i) => i !== index));
      },
    })();
  }

  return (
    <ContextContainer sx={(theme) => ({ marginTop: theme.spacing[4] })}>
      <Title order={6}>{t('otherEvents')}</Title>

      <Grid columns={100}>
        <Col span={24}>
          <Text role="productive" size="xs" color="primary" strong>
            {t(`name`)}
          </Text>
        </Col>
        <Col span={30}>
          <Text role="productive" size="xs" color="primary" strong>
            {t('init')}
          </Text>
        </Col>
        <Col span={30}>
          <Text role="productive" size="xs" color="primary" strong>
            {t('end')}
          </Text>
        </Col>
        <Col span={16} />
      </Grid>

      {value.map((val, index) => (
        <Grid key={index} columns={100}>
          <Col span={24}>
            <ColorBall
              colors={val.dayType === 'nonSchoolDays' ? ['#F6E1F3', '#ECD8E9'] : val.color}
              rotate={val.dayType === 'nonSchoolDays' ? -45 : 0}
              isSquare={val.dayType === 'schoolDays'}
              withBorder
              sx={(theme) => ({ marginRight: theme.spacing[2] })}
            />
            <Text role="productive" color="primary">
              {val.periodName}
            </Text>
          </Col>
          <Col span={30}>
            <Text role="productive" color="primary">
              {val.startDate.toLocaleDateString()}
            </Text>
          </Col>
          <Col span={30}>
            <Text role="productive" color="primary">
              {val.endDate ? val.endDate.toLocaleDateString() : val.startDate.toLocaleDateString()}
            </Text>
          </Col>
          <Col span={16}>
            <CalendarNewEventModal
              locale={locale}
              minDate={start}
              maxDate={end}
              closeOnClickOutside={false}
              opened={store.openedIndex === index}
              onClose={() => {
                store.openedIndex = null;
                render();
              }}
              disabled={disabled}
              values={val}
              onSubmit={(values) => {
                store.openedIndex = null;
                value[index] = values;
                onChange([...value]);
              }}
              target={
                <ActionButton
                  tooltip={t('edit')}
                  icon={<EditWriteIcon />}
                  onClick={() => {
                    store.openedIndex = index;
                    render();
                  }}
                />
              }
              {...eventModalProps}
            />

            <ActionButton
              tooltip={t('delete')}
              icon={<DeleteBinIcon />}
              onClick={() => removeIndex(index)}
            />
          </Col>
        </Grid>
      ))}

      <Box>
        <CalendarNewEventModal
          locale={locale}
          minDate={start}
          maxDate={end}
          closeOnClickOutside={false}
          disabled={disabled}
          opened={store.openAddButton}
          onClose={() => {
            store.openAddButton = false;
            render();
          }}
          values={{}}
          onSubmit={(values) => {
            store.openAddButton = false;
            onChange([...value, values]);
          }}
          target={
            <Button
              onClick={() => {
                store.openAddButton = true;
                render();
              }}
              variant="link"
              leftIcon={<AddCircleIcon />}
            >
              {t('addNewEvent')}
            </Button>
          }
          {...eventModalProps}
        />
      </Box>
    </ContextContainer>
  );
}

OtherEvents.propTypes = {
  locale: PropTypes.string,
  value: PropTypes.any,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  t: PropTypes.func,
};

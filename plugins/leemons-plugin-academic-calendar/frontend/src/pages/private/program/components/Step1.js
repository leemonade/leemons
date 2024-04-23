import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  ContextContainer,
  Select,
  Stack,
  Text,
  Title,
  Switch,
} from '@bubbles-ui/components';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import { useStore } from '@common';
import { Controller, useForm } from 'react-hook-form';
import FooterContainer from './FooterContainer';

export default function Step1({ regionalConfigs, program, config, onChange, t, scrollRef }) {
  const [, , , getErrorMessage] = useRequestErrorMessage();
  const [store] = useStore({
    dayWeeks: {
      1: t('monday'),
      2: t('tuesday'),
      3: t('wednesday'),
      4: t('thursday'),
      5: t('friday'),
      6: t('saturday'),
      0: t('sunday'),
    },
  });

  const regionalConfigsOptions = React.useMemo(
    () => _.map(regionalConfigs, (conf) => ({ value: conf.id, label: conf.name })),
    [regionalConfigs]
  );

  const { control, handleSubmit, reset } = useForm({
    defaultValues: config,
  });

  React.useEffect(() => {
    reset(config);
  }, [config]);

  function send() {
    handleSubmit((data) => {
      onChange(data);
    })();
  }

  if (!program) return null;

  return (
    <>
      <ContextContainer>
        <ContextContainer>
          <Title order={2}>{t('regionalConfig')}</Title>
          {program.centers[0].timezone ? (
            <Box>
              <Text role="productive" strong size="md" color="primary">
                {t('hourZone')}
              </Text>
              <Text role="productive" size="md" color="primary">
                {program.centers[0].timezone}
              </Text>
            </Box>
          ) : null}
          {program.centers[0].firstDayOfWeek ? (
            <Box>
              <Text role="productive" strong size="md" color="primary">
                {t('firstDayOfWeek')}
              </Text>
              <Text role="productive" size="md" color="primary">
                {store.dayWeeks[program.centers[0].firstDayOfWeek]}
              </Text>
            </Box>
          ) : null}
          <Box style={{ width: '50%' }}>
            <Controller
              control={control}
              name="regionalConfig"
              render={({ field }) => (
                <Select
                  {...field}
                  data={regionalConfigsOptions}
                  clearable
                  placeholder={t('selectCalendar')}
                  label={t('baseRegionalCalendar')}
                  autoSelectOneOption
                />
              )}
            />
          </Box>
        </ContextContainer>
        <Box
          sx={() => ({
            marginTop: 40,
          })}
        >
          <ContextContainer>
            <Title order={2}>{t('coursesConfig')}</Title>
            <Controller
              name="allCoursesHaveSameDates"
              control={control}
              render={({ field }) => (
                <Switch {...field} checked={field.value} label={t('allCoursesShareTheSameDates')} />
              )}
            />
          </ContextContainer>
        </Box>
      </ContextContainer>
      <FooterContainer scrollRef={scrollRef}>
        <Stack fullWidth justifyContent="end">
          <Button onClick={send}>{t('continueButton')}</Button>
        </Stack>
      </FooterContainer>
    </>
  );
}

Step1.propTypes = {
  regionalConfigs: PropTypes.array,
  program: PropTypes.any,
  config: PropTypes.any,
  t: PropTypes.func,
  onChange: PropTypes.func,
};

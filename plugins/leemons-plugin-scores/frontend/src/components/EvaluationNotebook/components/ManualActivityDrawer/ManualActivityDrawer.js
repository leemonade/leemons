import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import useRolesLocalizations from '@assignables/hooks/useRolesLocalizations';
import {
  Drawer,
  Button,
  ContextContainer,
  DatePicker,
  TextInput,
  Textarea,
  Box,
  Text,
  Select,
} from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { capitalize } from 'lodash';
import PropTypes from 'prop-types';

import { prefixPN } from '@scores/helpers';
import useWeights from '@scores/requests/hooks/queries/useWeights';

const defaultValues = { date: null, name: '', description: '' };

export function ManualActivityDrawer({
  isOpen,
  classId,
  onClose: _onClose,
  onSubmit,
  minDate,
  maxDate,
}) {
  const [t] = useTranslateLoader(prefixPN('manualActivityDrawer'));
  const [weightT] = useTranslateLoader(prefixPN('weightingTypes'));
  const form = useForm({ defaultValues });
  const [isLoading, setIsLoading] = useState(false);

  const { data: weights } = useWeights({ classId });
  const isRolesWeight = weights?.type === 'roles';

  const rolesLocalizations = useRolesLocalizations(['task', 'test']);

  const onClose = () => {
    _onClose();

    form.reset(defaultValues);
  };

  const handleSubmit = form.handleSubmit((data) => {
    setIsLoading(true);
    onSubmit(data)
      .then(onClose)
      .catch(() => {})
      .finally(() => setIsLoading(false));
  });

  return (
    <Drawer opened={isOpen} onClose={onClose}>
      <Drawer.Header title={t('title')} />

      <Drawer.Content>
        <ContextContainer title={t('config')}>
          <Controller
            control={form.control}
            name="date"
            rules={{ required: t('date.error') }}
            render={({ field, fieldState }) => (
              <Box sx={{ width: '50%' }}>
                <DatePicker
                  {...field}
                  label={t('date.label')}
                  error={fieldState.error?.message}
                  required
                  minDate={minDate}
                  maxDate={maxDate}
                />
              </Box>
            )}
          />

          <Controller
            control={form.control}
            name="name"
            rules={{ required: t('name.error') }}
            render={({ field, fieldState }) => (
              <Box sx={{ width: '50%' }}>
                <TextInput
                  {...field}
                  label={t('name.label')}
                  error={fieldState.error?.message}
                  required
                />
              </Box>
            )}
          />

          <Controller
            control={form.control}
            name="description"
            render={({ field }) => (
              <Box sx={{ width: '75%' }}>
                <Textarea {...field} label={t('description.label')} />
              </Box>
            )}
          />
        </ContextContainer>

        <ContextContainer title={t('weightType.title')}>
          <Text>
            {t('weightType.weightingBy')}{' '}
            <b style={{ textDecoration: 'underline' }}>{weightT(weights?.type ?? 'averages')}</b>,{' '}
            {t(`weightType.${weights?.type ?? 'averages'}`)}
          </Text>

          <Controller
            control={form.control}
            name="role"
            defaultValue={'task'}
            render={({ field }) =>
              isRolesWeight && (
                <Box sx={{ width: '50%' }}>
                  <Select
                    {...field}
                    label={t('roles')}
                    data={[
                      {
                        value: 'task',
                        label: capitalize(rolesLocalizations.task.singular),
                      },
                      {
                        value: 'tests',
                        label: capitalize(rolesLocalizations.tests.singular),
                      },
                    ]}
                  />
                </Box>
              )
            }
          />
        </ContextContainer>
      </Drawer.Content>

      <Drawer.Footer>
        <Drawer.Footer.LeftActions>
          <Button variant="link" onClick={onClose}>
            {t('cancel')}
          </Button>
        </Drawer.Footer.LeftActions>
        <Drawer.Footer.RightActions>
          <Button onClick={handleSubmit} loading={isLoading}>
            {t('save')}
          </Button>
        </Drawer.Footer.RightActions>
      </Drawer.Footer>
    </Drawer>
  );
}

ManualActivityDrawer.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  classId: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  minDate: PropTypes.instanceOf(Date),
  maxDate: PropTypes.instanceOf(Date),
};

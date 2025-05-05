import { useEffect, useState } from 'react';
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
import useCommonTranslate from '@multilanguage/helpers/useCommonTranslate';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { capitalize } from 'lodash';
import PropTypes from 'prop-types';

import { prefixPN } from '@scores/helpers';
import useWeights from '@scores/requests/hooks/queries/useWeights';

const defaultValues = { date: null, name: '', description: '' };

export function ManualActivityDrawer({
  activity,
  isOpen,
  classId,
  onClose: _onClose,
  onSubmit,
  minDate,
  maxDate,
}) {
  const [t] = useTranslateLoader(prefixPN('manualActivityDrawer'));
  const [tEval] = useTranslateLoader(prefixPN('evaluationNotebook'));
  const { t: tCommon } = useCommonTranslate('formWithTheme');
  const [weightT] = useTranslateLoader(prefixPN('weightingTypes'));

  const form = useForm({
    defaultValues,
  });
  const [isLoading, setIsLoading] = useState(false);

  const { data: weights } = useWeights({ classId, enabled: !!classId });
  const isRolesOrActivitiesWeight = weights?.type === 'roles' || weights?.type === 'activities';

  const rolesLocalizations = useRolesLocalizations(['task', 'test']);

  useEffect(() => {
    if (activity) {
      form.setValue('date', new Date(activity?.deadline));
      form.setValue('name', activity?.name ?? '');
      form.setValue('description', activity?.description ?? '');
    }
  }, [activity]);

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
      <Drawer.Header
        title={activity ? `${tCommon('edit')} - ${tEval('filters.manualActivity')}` : t('title')}
      />

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
                  disabled={!!activity}
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
              isRolesOrActivitiesWeight && (
                <Box sx={{ width: '50%' }}>
                  <Select
                    {...field}
                    label={t('roles')}
                    disabled={!!activity}
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
            {activity ? tCommon('save') : t('save')}
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
  activity: PropTypes.object,
};

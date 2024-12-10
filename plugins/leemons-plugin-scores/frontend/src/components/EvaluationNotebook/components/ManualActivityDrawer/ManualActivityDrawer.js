import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import {
  Drawer,
  Button,
  ContextContainer,
  DatePicker,
  TextInput,
  Textarea,
  Box,
} from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import PropTypes from 'prop-types';

import { prefixPN } from '@scores/helpers';

const defaultValues = { date: null, name: '', description: '' };

export function ManualActivityDrawer({ isOpen, onClose: _onClose, onSubmit, minDate, maxDate }) {
  const [t] = useTranslateLoader(prefixPN('manualActivityDrawer'));
  const form = useForm({ defaultValues });
  const [isLoading, setIsLoading] = useState(false);

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
                <Textarea {...field} label={t('description')} />
              </Box>
            )}
          />
        </ContextContainer>

        <ContextContainer title={t('weight')}></ContextContainer>
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
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  minDate: PropTypes.instanceOf(Date),
  maxDate: PropTypes.instanceOf(Date),
};

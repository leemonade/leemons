import React from 'react';
import PropTypes from 'prop-types';
import { Box, Button, ContextContainer, Select, Stack } from '@bubbles-ui/components';
import { Controller } from 'react-hook-form';
import { ChevLeftIcon, ChevRightIcon } from '@bubbles-ui/icons/outline';
import { useTestsTypes } from '../../../../helpers/useTestsTypes';

/*
* <Controller
          control={form.control}
          name="program"
          rules={{ required: t('programRequired') }}
          render={({ field }) => (
            <Select
              required
              error={isDirty ? form.formState.errors.program : null}
              label={t('programLabel')}
              data={store.programsData || []}
              autoSelectOneOption
              {...field}
            />
          )}
        />

        <Controller
          control={form.control}
          name="subjects"
          rules={{ required: t('subjectRequired') }}
          render={({ field }) => (
            <Select
              required
              error={isDirty ? form.formState.errors.subjects : null}
              label={t('subjectLabel')}
              disabled={!program}
              data={store.subjectsByProgram[program] || []}
              autoSelectOneOption
              {...field}
              value={field.value ? field.value[0] : field.value}
              onChange={(e) => {
                field.onChange(e ? [e] : e);
              }}
            />
          )}
        />
* */

export default function DetailConfig({ store, form, t, onNext, onPrev }) {
  const [isDirty, setIsDirty] = React.useState(false);
  const testTypes = useTestsTypes();
  const program = form.watch('program');
  const type = form.watch('type');
  const selectedType = testTypes.find(({ value }) => value === type);

  async function next() {
    setIsDirty(true);
    const formGood = await form.trigger(['type']);
    if (formGood) {
      onNext();
    }
  }

  return (
    <ContextContainer divided>
      <ContextContainer>
        <Controller
          control={form.control}
          name="type"
          render={({ field }) => (
            <Select
              required
              error={isDirty ? form.formState.errors.type : null}
              label={t('typeLabel')}
              data={testTypes}
              {...field}
            />
          )}
        />

        {/*
        {selectedType && selectedType.canGradable ? (
          <Controller
            control={form.control}
            name="gradable"
            render={({ field }) => (
              <Switch {...field} label={t('gradableLabel')} checked={field.value} />
            )}
          />
        ) : null}
        */}
      </ContextContainer>
      <Stack fullWidth justifyContent="space-between">
        <Box>
          <Button
            compact
            variant="light"
            leftIcon={<ChevLeftIcon height={20} width={20} />}
            onClick={onPrev}
          >
            {t('previous')}
          </Button>
        </Box>
        <Box>
          <Button rightIcon={<ChevRightIcon height={20} width={20} />} onClick={next}>
            {t('continue')}
          </Button>
        </Box>
      </Stack>
    </ContextContainer>
  );
}

DetailConfig.propTypes = {
  form: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  onNext: PropTypes.func,
  store: PropTypes.any,
};

import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  ContextContainer,
  Select,
  TotalLayoutStepContainer,
  TotalLayoutFooterContainer,
} from '@bubbles-ui/components';
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

export default function DetailConfig({
  store,
  form,
  t,
  stepName,
  scrollRef,
  onNext,
  onPrev,
  onSave,
}) {
  const [isDirty, setIsDirty] = React.useState(false);
  const testTypes = useTestsTypes();
  const formValues = form.watch();

  // const program = form.watch('program');
  // const type = form.watch('type');
  // const selectedType = testTypes.find(({ value }) => value === type);

  const validate = async () => form.trigger(['type']);

  async function handleOnNext() {
    setIsDirty(true);
    if (await validate()) {
      onNext();
    }
  }

  async function handleOnSave() {
    setIsDirty(true);
    if (await validate()) {
      onSave();
    }
  }

  return (
    <TotalLayoutStepContainer
      stepName={stepName}
      Footer={
        <TotalLayoutFooterContainer
          fixed
          scrollRef={scrollRef}
          leftZone={
            <Button
              variant="outline"
              leftIcon={<ChevLeftIcon height={20} width={20} />}
              onClick={onPrev}
            >
              {t('previous')}
            </Button>
          }
          rightZone={
            <>
              {!formValues.published ? (
                <Button
                  variant="link"
                  onClick={handleOnSave}
                  disabled={!formValues.name || store.saving}
                  loading={store.saving === 'draft'}
                >
                  {t('saveDraft')}
                </Button>
              ) : null}

              <Button
                rightIcon={<ChevRightIcon height={20} width={20} />}
                onClick={handleOnNext}
                disabled={store.saving}
                loading={store.saving === 'publish'}
              >
                {t('next')}
              </Button>
            </>
          }
        />
      }
    >
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
    </TotalLayoutStepContainer>
  );
}

DetailConfig.propTypes = {
  t: PropTypes.func.isRequired,
  form: PropTypes.object.isRequired,
  onNext: PropTypes.func,
  onPrev: PropTypes.func,
  onSave: PropTypes.func,
  store: PropTypes.any,
  stepName: PropTypes.string,
  scrollRef: PropTypes.any,
};

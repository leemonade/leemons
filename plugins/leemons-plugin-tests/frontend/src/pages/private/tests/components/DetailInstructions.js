import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { noop } from 'lodash';
import {
  Button,
  ContextContainer,
  TotalLayoutStepContainer,
  TotalLayoutFooterContainer,
  Box,
} from '@bubbles-ui/components';
import { TextEditorInput } from '@bubbles-ui/editors';
import { Controller } from 'react-hook-form';
import { ChevLeftIcon } from '@bubbles-ui/icons/outline';
import { Attachments } from '@leebrary/components';
import TimeUnitsInput from '@common/components/TimeUnitsInput';
import FinalDropdown from './FinalDropdown';

export default function DetailInstructions({
  t,
  form,
  store,
  stepName,
  scrollRef,
  hasResources,
  hasInstructions,
  onSave = noop,
  onPublish = noop,
  onAssign = noop,
  onPrev = noop,
}) {
  const [isDirty, setIsDirty] = useState(false);
  const formValues = form.watch();

  // ························································
  // HANDLERS

  const validate = async () => form.trigger(['instructionsForTeachers', 'instructionsForStudents']);

  async function handleOnSave() {
    setIsDirty(true);
    if (await validate()) {
      onSave();
    }
  }

  const attachmentsLabels = {
    addResource: t('addResourcesLabel'),
  };

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
                  disabled={store.saving}
                  loading={store.saving === 'draft'}
                >
                  {t('saveDraft')}
                </Button>
              ) : null}

              <FinalDropdown
                t={t}
                form={form}
                store={store}
                setIsDirty={setIsDirty}
                onAssign={onAssign}
                onPublish={onPublish}
              />
            </>
          }
        />
      }
    >
      <Box>
        {hasResources && (
          <Box style={{ marginBottom: 24 }}>
            <ContextContainer title={hasInstructions && hasResources ? t('resources') : ''}>
              <Attachments
                labels={attachmentsLabels}
                setValue={form.setValue}
                getValues={form.getValues}
              />
            </ContextContainer>
          </Box>
        )}
        {hasInstructions && (
          <ContextContainer title={hasInstructions && hasResources ? t('instructions') : ''}>
            <Controller
              control={form.control}
              name="instructionsForTeachers"
              render={({ field }) => (
                <TextEditorInput
                  error={isDirty ? form.formState.errors.instructionsForTeachers : null}
                  label={t('instructionsForTeacherLabel')}
                  editorStyles={{ minHeight: '96px' }}
                  {...field}
                />
              )}
            />
            <Controller
              control={form.control}
              name="instructionsForStudents"
              render={({ field }) => (
                <TextEditorInput
                  error={isDirty ? form.formState.errors.instructionsForStudents : null}
                  label={t('instructionsForStudentLabel')}
                  editorStyles={{ minHeight: '96px' }}
                  {...field}
                />
              )}
            />
            <Box style={{ marginBottom: 24 }}>
              <Controller
                control={form.control}
                name="duration"
                rules={{
                  required: t('recommendedDuration'),
                  min: { value: 1, message: t('recommendedDuration') },
                }}
                render={({ field }) => (
                  <TimeUnitsInput {...field} label={t('recommendedDuration')} min={1} />
                )}
              />
            </Box>
          </ContextContainer>
        )}
      </Box>
    </TotalLayoutStepContainer>
  );
}

DetailInstructions.propTypes = {
  t: PropTypes.func.isRequired,
  form: PropTypes.object.isRequired,
  onPublish: PropTypes.func,
  onAssign: PropTypes.func,
  onPrev: PropTypes.func,
  onSave: PropTypes.func,
  stepName: PropTypes.string,
  scrollRef: PropTypes.any,
  store: PropTypes.any,
  hasInstructions: PropTypes.bool,
  hasResources: PropTypes.bool,
};

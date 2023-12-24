import React from 'react';
import PropTypes from 'prop-types';
import { noop } from 'lodash';
import {
  Box,
  Button,
  DropdownButton,
  ContextContainer,
  TotalLayoutStepContainer,
  TotalLayoutFooterContainer,
} from '@bubbles-ui/components';
import { TextEditorInput } from '@bubbles-ui/editors';
import { Controller } from 'react-hook-form';
import { ChevLeftIcon } from '@bubbles-ui/icons/outline';

export default function DetailInstructions({
  t,
  form,
  store,
  stepName,
  scrollRef,
  onSave = noop,
  onPublish = noop,
  onAssign = noop,
  onPrev = noop,
}) {
  const [isDirty, setIsDirty] = React.useState(false);
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

  async function handleOnPublish() {
    console.log('handleOnPublish');
    setIsDirty(true);
    if (await validate()) {
      onPublish();
    }
  }

  async function handleOnAssign() {
    setIsDirty(true);
    if (await validate()) {
      onAssign();
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
                  disabled={store.saving}
                  loading={store.saving === 'draft'}
                >
                  {t('saveDraft')}
                </Button>
              ) : null}

              <DropdownButton
                data={[
                  { label: t('onlyPublish'), onClick: handleOnPublish },
                  { label: t('publishAndAssign'), onClick: handleOnAssign },
                ]}
                loading={store.saving === 'publish'}
                disabled={store.saving}
              >
                {t('finish')}
              </DropdownButton>
            </>
          }
        />
      }
    >
      <Box>
        <ContextContainer>
          <Controller
            control={form.control}
            name="instructionsForTeachers"
            render={({ field }) => (
              <TextEditorInput
                error={isDirty ? form.formState.errors.instructionsForTeachers : null}
                label={t('instructionsForTeacherLabel')}
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
                {...field}
              />
            )}
          />
        </ContextContainer>
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
};

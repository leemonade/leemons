import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Stack,
  Button,
  DropdownButton,
  ContextContainer,
  TotalLayoutStepContainer,
  TotalLayoutFooterContainer,
} from '@bubbles-ui/components';
import Curriculum from '@tasks/components/TaskSetupPage/components/Curriculum';
import Objectives from '@tasks/components/TaskSetupPage/components/Objectives';
import { ChevLeftIcon, ChevRightIcon } from '@bubbles-ui/icons/outline';
import { find, map, noop } from 'lodash';

export default function DetailEvaluation({
  t,
  form,
  store,
  stepName,
  scrollRef,
  isLastStep,
  onNext = noop,
  onSave = noop,
  onPublish = noop,
  onAssign = noop,
  onPrev = noop,
}) {
  const [isDirty, setIsDirty] = React.useState(false);
  const formValues = form.watch();
  const validate = async () => form.trigger(['instructionsForTeachers', 'instructionsForStudents']);

  const programId = form.getValues('program');
  const subjectIds = form.getValues('subjects');

  const subjects = store.subjectsByProgram[programId];
  const subject = find(subjects, { value: subjectIds?.[0]?.subject });

  // ························································
  // HANDLERS

  async function handleOnSave() {
    setIsDirty(true);
    if (await validate()) {
      onSave();
    }
  }

  async function handleOnNext() {
    setIsDirty(true);
    if (await validate()) {
      onNext();
    }
  }

  async function handleOnPublish() {
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
              {isLastStep ? (
                <DropdownButton
                  data={[
                    { label: t('onlyPublish'), action: handleOnPublish },
                    { label: t('publishAndAssign'), action: handleOnAssign },
                  ]}
                  loading={store.saving === 'publish'}
                  disabled={store.saving}
                >
                  {t('finish')}
                </DropdownButton>
              ) : (
                <Button
                  rightIcon={<ChevRightIcon height={20} width={20} />}
                  onClick={handleOnNext}
                  disabled={store.saving}
                  loading={store.saving === 'publish'}
                >
                  {t('continue')}
                </Button>
              )}
            </>
          }
        />
      }
    >
      <Box>
        <ContextContainer>
          {formValues.config?.hasCurriculum && (
            <ContextContainer title={t('curriculum')} subtitle={subject ? subject.label : null}>
              <Curriculum
                program={form.getValues('program')}
                subjects={map(form.getValues('subjects'), 'subject')}
                name="curriculum.curriculum"
                control={form.control}
                addLabel={t('addFromCurriculum')}
              />
            </ContextContainer>
          )}
          {formValues.config?.hasObjectives && (
            <ContextContainer title={t('objectivesCurriculum')}>
              <Objectives form={form} name={`curriculum.objectives`} />
            </ContextContainer>
          )}
        </ContextContainer>
      </Box>
    </TotalLayoutStepContainer>
  );
}

DetailEvaluation.propTypes = {
  t: PropTypes.func.isRequired,
  form: PropTypes.object.isRequired,
  store: PropTypes.any,
  scrollRef: PropTypes.any,
  stepName: PropTypes.string,
  isLastStep: PropTypes.bool,
  onSave: PropTypes.func,
  onNext: PropTypes.func,
  onPrev: PropTypes.func,
  onAssign: PropTypes.func,
  onPublish: PropTypes.func,
};

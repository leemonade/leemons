import {
  Box,
  Button,
  Stack,
  ContextContainer,
  Switch,
  TotalLayoutStepContainer,
  TotalLayoutFooterContainer,
} from '@bubbles-ui/components';
import { TextEditorInput } from '@bubbles-ui/editors';
import { ChevLeftIcon, ChevRightIcon } from '@bubbles-ui/icons/outline';

import { noop } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { Controller } from 'react-hook-form';
// import Objectives from '@tasks/components/TaskSetupPage/components/Objectives';

export default function DetailContent({
  t,
  form,
  store,
  stepName,
  scrollRef,
  onSave = noop,
  onNext = noop,
  onPrev = noop,
}) {
  const [isDirty, setIsDirty] = React.useState(false);
  const formValues = form.watch();

  const validate = async () => form.trigger(['statement']);

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
                  disabled={store.saving}
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
      <Box>
        <ContextContainer>
          <ContextContainer title={t('statement')}>
            <Controller
              control={form.control}
              name="statement"
              render={({ field }) => (
                <TextEditorInput
                  required
                  error={isDirty ? form.formState.errors.statement : null}
                  label={t('statementLabel')}
                  placeholder={t('statementPlaceholder')}
                  editorStyles={{ minHeight: '96px' }}
                  {...field}
                />
              )}
            />
          </ContextContainer>

          {formValues.subjects?.length > 0 && (
            <ContextContainer title={t('evaluationCriteria')}>
              <Stack direction="column">
                <Controller
                  control={form.control}
                  name="config.hasCurriculum"
                  disabled
                  render={({ field }) => (
                    <Switch {...field} checked={field.value} label={t('enableCurriculum')} />
                  )}
                />
                <Controller
                  control={form.control}
                  name="config.hasObjectives"
                  render={({ field }) => (
                    <Switch {...field} checked={field.value} label={t('addCustomObjectives')} />
                  )}
                />
              </Stack>
            </ContextContainer>
          )}

          <ContextContainer title={t('other')}>
            <Stack direction="column">
              <Controller
                control={form.control}
                name="config.hasResources"
                render={({ field }) => (
                  <Switch {...field} checked={field.value} label={t('addResourcesLabel')} />
                )}
              />

              <Controller
                control={form.control}
                name="config.hasInstructions"
                render={({ field }) => (
                  <Switch {...field} checked={field.value} label={t('addInstructions')} />
                )}
              />
            </Stack>
          </ContextContainer>

          {/* <ContextContainer title={t('curriculum')} subtitle={subject ? subject.label : null}>
            <Curriculum
              program={form.getValues('program')}
              subjects={_.map(form.getValues('subjects'), 'subject')}
              name="curriculum.curriculum"
              control={form.control}
              addLabel={t('addFromCurriculum')}
            />
          </ContextContainer> */}

          {/* <Objectives
            form={form}
            name={`curriculum.objectives`}
            label={t('objectivesCurriculum')}
          /> */}
        </ContextContainer>
      </Box>
    </TotalLayoutStepContainer>
  );
}

DetailContent.propTypes = {
  t: PropTypes.func.isRequired,
  form: PropTypes.object.isRequired,
  onNext: PropTypes.func,
  onPrev: PropTypes.func,
  onSave: PropTypes.func,
  stepName: PropTypes.string,
  scrollRef: PropTypes.any,
  store: PropTypes.any,
};

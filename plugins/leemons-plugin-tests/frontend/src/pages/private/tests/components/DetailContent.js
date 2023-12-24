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
// import Curriculum from '@tasks/components/TaskSetupPage/components/Curriculum';
// import Objectives from '@tasks/components/TaskSetupPage/components/Objectives';
import { noop } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { Controller } from 'react-hook-form';

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
                {t('continue')}
              </Button>
            </>
          }
        />
      }
    >
      <Box>
        <ContextContainer>
          <ContextContainer title="Enunciado">
            <Controller
              control={form.control}
              name="statement"
              render={({ field }) => (
                <TextEditorInput
                  required
                  error={isDirty ? form.formState.errors.statement : null}
                  label={t('statementLabel')}
                  {...field}
                />
              )}
            />
          </ContextContainer>

          {formValues.subjects?.length > 0 && (
            <ContextContainer title="Criterios de evaluación">
              <Stack direction="column">
                <Controller
                  control={form.control}
                  name="config.hasCurriculum"
                  render={({ field }) => (
                    <Switch {...field} checked={field.value} label="Habilitar Curriculum" />
                  )}
                />
                <Controller
                  control={form.control}
                  name="config.hasObjectives"
                  render={({ field }) => (
                    <Switch
                      {...field}
                      checked={field.value}
                      label="Habilitar objetivos personalizados"
                    />
                  )}
                />
              </Stack>
            </ContextContainer>
          )}

          <ContextContainer title="Otros">
            <Stack direction="column">
              {/*
              <Controller
                control={form.control}
                name="config.hasResources"
                render={({ field }) => (
                  <Switch {...field} checked={field.value} label="Añadir recursos" />
                )}
              />
              */}
              <Controller
                control={form.control}
                name="config.hasInstructions"
                render={({ field }) => (
                  <Switch {...field} checked={field.value} label="Añadir instrucciones" />
                )}
              />
            </Stack>
          </ContextContainer>
          {/* 
          <ContextContainer title={t('curriculum')} subtitle={subject ? subject.label : null}>
            <Curriculum
              program={form.getValues('program')}
              subjects={_.map(form.getValues('subjects'), 'subject')}
              name="curriculum.curriculum"
              control={form.control}
              addLabel={t('addFromCurriculum')}
            />
          </ContextContainer>

          <Objectives
            form={form}
            name={`curriculum.objectives`}
            label={t('objectivesCurriculum')}
          />
          */}
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

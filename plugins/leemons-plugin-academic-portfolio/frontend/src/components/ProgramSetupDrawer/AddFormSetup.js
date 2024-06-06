import React from 'react';
import { isBoolean } from 'lodash';
import PropTypes from 'prop-types';

import {
  ContextContainer,
  RadioGroup,
  Title,
  createStyles,
  Stack,
  Button,
  TotalLayoutStepContainer,
  TotalLayoutContainer,
} from '@bubbles-ui/components';
import { Controller, useForm } from 'react-hook-form';
import { Header } from '@leebrary/components/AssetPickerDrawer/components/Header';
import FooterContainer from './FooterContainer';

const useFormSetupStyles = createStyles((theme) => ({
  title: {
    ...theme.other.global.content.typo.heading.md,
  },
  sectionTitle: {
    ...theme.other.global.content.typo.heading['xsm--semiBold'],
  },
  nestedQuestions: {
    paddingLeft: 40,
  },
}));

const FormSetup = ({ scrollRef, onCancel, onSetup, localizations }) => {
  const { classes } = useFormSetupStyles();
  const { watch, control, formState, handleSubmit } = useForm();
  const { moreThanOneCourse, sequentialCourses, creditsSystem } = watch();

  return (
    <TotalLayoutContainer
      clean
      scrollRef={scrollRef}
      Header={
        <Header
          localizations={{
            title: localizations?.programDrawer.title,
            close: localizations?.labels.cancel,
          }}
          onClose={onCancel}
        />
      }
    >
      <Stack
        ref={scrollRef}
        sx={{
          padding: 24,
          overflowY: 'auto',
          overflowX: 'hidden',
          marginBottom: 100,
        }}
      >
        <TotalLayoutStepContainer clean>
          <ContextContainer direction="column" spacing={8}>
            <form onSubmit={handleSubmit(onSetup)}>
              <ContextContainer noFlex spacing={4}>
                <Title className={classes.title}>
                  {localizations?.programDrawer?.wizardForm?.customization}
                </Title>
                <ContextContainer noFlex alignItems="start">
                  <Title className={classes.sectionTitle}>
                    {localizations?.programDrawer?.wizardForm?.temporalStructure}
                  </Title>
                  <Controller
                    name="moreThanOneCourse"
                    control={control}
                    rules={{
                      validate: (value) =>
                        isBoolean(value) || localizations?.programDrawer?.requiredField,
                    }}
                    render={({ field }) => (
                      <RadioGroup
                        {...field}
                        label={
                          localizations?.programDrawer?.wizardForm?.doesItHaveMoreThanOneCourse
                        }
                        data={[
                          { label: localizations?.programDrawer?.wizardForm?.yes, value: true },
                          { label: localizations?.programDrawer?.wizardForm?.no, value: false },
                        ]}
                        error={formState.errors.moreThanOneCourse}
                      />
                    )}
                  />
                  {moreThanOneCourse && (
                    <ContextContainer className={classes.nestedQuestions}>
                      <Controller
                        name="sequentialCourses"
                        control={control}
                        rules={{
                          validate: (value) =>
                            isBoolean(value) || localizations?.programDrawer?.requiredField,
                        }}
                        render={({ field }) => (
                          <RadioGroup
                            {...field}
                            label={
                              localizations?.programDrawer?.wizardForm?.doesItHaveSequentialCourses
                            }
                            data={[
                              { label: localizations?.programDrawer?.wizardForm?.yes, value: true },
                              { label: localizations?.programDrawer?.wizardForm?.no, value: false },
                            ]}
                            error={formState.errors.sequentialCourses}
                          />
                        )}
                      />
                    </ContextContainer>
                  )}
                  {moreThanOneCourse && sequentialCourses && (
                    <ContextContainer className={classes.nestedQuestions}>
                      <Controller
                        name="hasCycles"
                        control={control}
                        rules={{
                          validate: (value) =>
                            isBoolean(value) || localizations?.programDrawer?.requiredField,
                        }}
                        render={({ field }) => (
                          <RadioGroup
                            {...field}
                            label={localizations?.programDrawer?.wizardForm?.doesItHaveCycles}
                            data={[
                              { label: localizations?.programDrawer?.wizardForm?.yes, value: true },
                              { label: localizations?.programDrawer?.wizardForm?.no, value: false },
                            ]}
                            error={formState.errors.hasCycles}
                          />
                        )}
                      />
                    </ContextContainer>
                  )}
                  <Controller
                    name="hasSubstages"
                    control={control}
                    rules={{
                      validate: (value) =>
                        isBoolean(value) || localizations?.programDrawer?.requiredField,
                    }}
                    render={({ field }) => (
                      <RadioGroup
                        {...field}
                        label={localizations?.programDrawer?.wizardForm?.doesItHaveSubstages}
                        data={[
                          { label: localizations?.programDrawer?.wizardForm?.yes, value: true },
                          { label: localizations?.programDrawer?.wizardForm?.no, value: false },
                        ]}
                        error={formState.errors.hasSubstagesPerCourse}
                      />
                    )}
                  />
                </ContextContainer>
                <ContextContainer noFlex alignItems="start">
                  <Title className={classes.sectionTitle}>
                    {localizations?.programDrawer?.classroomsAndGroups}
                  </Title>
                  <Controller
                    name="knowledgeAreas"
                    control={control}
                    rules={{
                      validate: (value) =>
                        isBoolean(value) || localizations?.programDrawer?.requiredField,
                    }}
                    render={({ field }) => (
                      <RadioGroup
                        {...field}
                        label={localizations?.programDrawer?.wizardForm?.doesItHaveKnowledgeAreas}
                        data={[
                          { label: localizations?.programDrawer?.wizardForm?.yes, value: true },
                          { label: localizations?.programDrawer?.wizardForm?.no, value: false },
                        ]}
                        error={formState.errors.knowledgeAreas}
                      />
                    )}
                  />
                  <Controller
                    name="subjectTypes"
                    control={control}
                    rules={{
                      validate: (value) =>
                        isBoolean(value) || localizations?.programDrawer?.requiredField,
                    }}
                    render={({ field }) => (
                      <RadioGroup
                        {...field}
                        label={localizations?.programDrawer?.wizardForm?.doesItHaveSubjectTypes}
                        data={[
                          { label: localizations?.programDrawer?.wizardForm?.yes, value: true },
                          { label: localizations?.programDrawer?.wizardForm?.no, value: false },
                        ]}
                        error={formState.errors.subjectTypes}
                      />
                    )}
                  />
                  <Controller
                    name="customSubjectIds"
                    control={control}
                    rules={{
                      validate: (value) =>
                        isBoolean(value) || localizations?.programDrawer?.requiredField,
                    }}
                    render={({ field }) => (
                      <RadioGroup
                        {...field}
                        label={
                          localizations?.programDrawer?.wizardForm?.doItsSubjectsHaveAnUniqueId
                        }
                        data={[
                          { label: localizations?.programDrawer?.wizardForm?.yes, value: true },
                          { label: localizations?.programDrawer?.wizardForm?.no, value: false },
                        ]}
                        error={formState.errors.customSubjectIds}
                      />
                    )}
                  />
                  <Controller
                    name="referenceGroups"
                    control={control}
                    rules={{
                      validate: (value) =>
                        isBoolean(value) || localizations?.programDrawer?.requiredField,
                    }}
                    render={({ field }) => (
                      <RadioGroup
                        {...field}
                        label={localizations?.programDrawer?.wizardForm?.doesItHaveReferenceGroups}
                        data={[
                          { label: localizations?.programDrawer?.wizardForm?.yes, value: true },
                          { label: localizations?.programDrawer?.wizardForm?.no, value: false },
                        ]}
                        error={formState.errors.referenceGroups}
                      />
                    )}
                  />
                </ContextContainer>
                <ContextContainer noFlex alignItems="start">
                  <Title className={classes.sectionTitle}>
                    {localizations?.programDrawer.others}
                  </Title>
                  <Controller
                    name="creditsSystem"
                    control={control}
                    rules={{
                      validate: (value) =>
                        isBoolean(value) || localizations?.programDrawer?.requiredField,
                    }}
                    render={({ field }) => (
                      <RadioGroup
                        {...field}
                        label={localizations?.programDrawer?.wizardForm?.doesItHaveOfficialCredits}
                        data={[
                          { label: localizations?.programDrawer?.wizardForm?.yes, value: true },
                          { label: localizations?.programDrawer?.wizardForm?.no, value: false },
                        ]}
                        error={formState.errors.creditsSystem}
                      />
                    )}
                  />
                  {!creditsSystem && isBoolean(creditsSystem) && (
                    <Controller
                      name="durationInHours"
                      control={control}
                      rules={{
                        validate: (value) =>
                          isBoolean(value) || localizations?.programDrawer?.requiredField,
                      }}
                      render={({ field }) => (
                        <RadioGroup
                          {...field}
                          label={
                            localizations?.programDrawer?.wizardForm
                              ?.doesItHaveADefinedAmountOfHours
                          }
                          data={[
                            { label: localizations?.programDrawer?.wizardForm?.yes, value: true },
                            { label: localizations?.programDrawer?.wizardForm?.no, value: false },
                          ]}
                          error={formState.errors.durationInHours}
                        />
                      )}
                    />
                  )}
                </ContextContainer>
                <FooterContainer scrollRef={scrollRef}>
                  <Stack justifyContent={'space-between'} fullWidth>
                    <Button variant="outline" type="button" onClick={onCancel}>
                      {localizations?.labels.cancel}
                    </Button>
                    <Button type="submit">{localizations?.programDrawer?.save}</Button>
                  </Stack>
                </FooterContainer>
              </ContextContainer>
            </form>
          </ContextContainer>
        </TotalLayoutStepContainer>
      </Stack>
    </TotalLayoutContainer>
  );
};

FormSetup.propTypes = {
  scrollRef: PropTypes.any,
  onCancel: PropTypes.func,
  onSetup: PropTypes.func,
  localizations: PropTypes.object,
};

export default FormSetup;

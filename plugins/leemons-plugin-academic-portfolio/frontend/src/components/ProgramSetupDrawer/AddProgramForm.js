import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Controller, useForm } from 'react-hook-form';
import {
  ContextContainer,
  Title,
  createStyles,
  Stack,
  Button,
  TextInput,
  ColorInput,
  InputWrapper,
  NumberInput,
  Text,
  Checkbox,
} from '@bubbles-ui/components';
import { EvaluationsSelect } from '@grades/components/EvaluationsSelect';
import ImagePicker from '@leebrary/components/ImagePicker';
import FooterContainer from './FooterContainer';
import SubstagesSetup from './SubstagesSetup';
import CoursesSetup from './CoursesSetup';
import CyclesSetup from './CyclesSetup';
import ReferenceGroupsSetup from './ReferenceGroupsSetup';
import SeatsPerCourseSetup from './SeatsPerCourseSetup';

const useAddProgramFormStyles = createStyles((theme) => ({
  title: {
    ...theme.other.global.content.typo.heading.md,
  },
  sectionTitle: {
    ...theme.other.global.content.typo.heading['xsm--semiBold'],
  },
  horizontalInputsContainer: {
    gap: 16,
  },
}));

const AddProgramForm = ({
  scrollRef,
  onCancel,
  setupData,
  onSubmit,
  centerId,
  drawerIsLoading,
}) => {
  const { classes } = useAddProgramFormStyles();
  const form = useForm();
  const { control, formState, setValue, watch } = form;
  const { hoursPerCredit, credits, courses } = watch();

  const totalHours = useMemo(() => {
    if (!credits || !hoursPerCredit) return null;
    return parseInt(hoursPerCredit) * parseInt(credits);
  }, [hoursPerCredit, credits]);

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <ContextContainer sx={{ marginBottom: 100 }} direction="column" spacing={8}>
        {/* SECTION: BASIC DATA */}
        <ContextContainer direction="column" spacing={4}>
          <Title className={classes.title}>{'Basic Data 🌎'}</Title>
          <ContextContainer noFlex spacing={4}>
            <Title className={classes.sectionTitle}>{'Presentation 🌎'}</Title>
            <Stack className={classes.horizontalInputsContainer}>
              <Controller
                control={control}
                name="name"
                rules={{ required: 'Required field 🌎' }}
                render={({ field }) => (
                  <TextInput
                    {...field}
                    label={'Name 🌎'}
                    placeholder={'Name 🌎'}
                    error={formState.errors.name}
                    required
                    sx={{ width: 216 }}
                  />
                )}
              />
              <Controller
                control={control}
                name="abbreviation"
                rules={{
                  required: 'Required field 🌎',
                  maxLength: { value: 8, message: 'Max 8 characters 🌎' },
                }}
                render={({ field }) => (
                  <TextInput
                    {...field}
                    label={'Abbreviation 🌎'}
                    placeholder={'Abbreviation 🌎'}
                    error={formState.errors.abbreviation}
                    required
                    sx={{ width: 216 }}
                  />
                )}
              />
              <Controller
                control={control}
                name="color"
                rules={{ required: 'Required field 🌎' }}
                render={({ field }) => (
                  <ColorInput
                    {...field}
                    label={'Color 🌎'}
                    placeholder={'Color 🌎'}
                    useHsl
                    compact={false}
                    manual={false}
                    contentStyle={{ width: 216 }}
                    required
                  />
                )}
              />
            </Stack>
            <Controller
              control={control}
              name="image"
              render={({ field }) => (
                <InputWrapper label="Featured image 🌎">
                  <ImagePicker {...field} />
                </InputWrapper>
              )}
            />
          </ContextContainer>

          {/* REGLAS ACADÉMICAS */}
          <ContextContainer noFlex spacing={4}>
            <Title className={classes.sectionTitle}>{'Academic Rules 🌎'}</Title>
            <Controller
              name="evaluationSystem"
              control={control}
              rules={{
                required: 'Required field 🌎',
              }}
              render={({ field, fieldState }) => (
                <EvaluationsSelect
                  {...field}
                  center={centerId}
                  sx={{ width: 216 }}
                  placeholder={'Selecciona un sistema... 🌎'}
                  error={fieldState.error}
                />
              )}
            />
          </ContextContainer>

          {/* DURACIÓN Y CRÉDITOS */}
          {(setupData?.creditsSystem || setupData?.durationInHours) && (
            <ContextContainer noFlex spacing={4}>
              <Title className={classes.sectionTitle}>
                {setupData?.durationInHours ? 'Duration 🌎' : 'Duration and Credits 🌎'}
              </Title>
              {setupData?.creditsSystem && (
                <Stack className={classes.horizontalInputsContainer}>
                  <Stack className={classes.horizontalInputsContainer}>
                    <Controller
                      name="hoursPerCredit"
                      control={control}
                      rules={{ required: 'Required field 🌎' }}
                      render={({ field, fieldState }) => (
                        <NumberInput
                          {...field}
                          min={1}
                          label={'Hours per credit 🌎'}
                          sx={{ width: 216 }}
                          placeholder={'hours 🌎'}
                          error={fieldState.error?.message}
                        />
                      )}
                    />
                    <Controller
                      name="credits"
                      control={control}
                      rules={{ required: 'Required field 🌎' }}
                      render={({ field, fieldState }) => (
                        <NumberInput
                          {...field}
                          label={'Nº of credits 🌎'}
                          min={1}
                          sx={{ width: 216 }}
                          placeholder={'hours 🌎'}
                          error={fieldState.error?.message}
                        />
                      )}
                    />
                  </Stack>
                  <Text sx={{ alignSelf: 'end', padding: 12 }}>
                    {totalHours ? `${totalHours} total hours 🌎` : ''}
                  </Text>
                </Stack>
              )}
              {setupData?.durationInHours && (
                <Controller
                  name="totalHours"
                  control={control}
                  rules={{ required: 'Required field 🌎' }}
                  render={({ field, fieldState }) => (
                    <NumberInput
                      {...field}
                      min={1}
                      label={'Durations (hours) 🌎'}
                      sx={{ width: 216 }}
                      placeholder={'Total hours 🌎'}
                      error={fieldState.error?.message}
                    />
                  )}
                />
              )}
            </ContextContainer>
          )}
        </ContextContainer>

        {/* SECTION: TEMPORAL STRUCTURE */}
        {(setupData?.hasSubstages || setupData?.moreThanOneCourse) && (
          <ContextContainer direction="column" spacing={4}>
            <Title className={classes.title}>{'Temporal Structure 🌎 '}</Title>
            {setupData?.hasSubstages && (
              <ContextContainer noFlex spacing={4}>
                <Title className={classes.sectionTitle}>{'Course substages 🌎'}</Title>
                <Controller
                  name="substages"
                  control={control}
                  rules={{ required: 'Required field 🌎' }}
                  render={({ field }) => (
                    <InputWrapper error={formState.errors.substages}>
                      <SubstagesSetup {...field} />
                    </InputWrapper>
                  )}
                />
              </ContextContainer>
            )}
            {setupData?.moreThanOneCourse && (
              <>
                <ContextContainer noFlex spacing={4}>
                  <Title className={classes.sectionTitle}>{'Courses 🌎'}</Title>
                  <Controller
                    name="courses"
                    control={control}
                    rules={{ required: 'Required field 🌎' }}
                    render={({ field }) => (
                      <CoursesSetup
                        {...field}
                        showCredits={!!setupData?.creditsSystem}
                        maxNumberOfCredits={parseInt(credits) || 0}
                        onChange={(data) => {
                          setValue('courses', data);
                        }}
                      />
                    )}
                  />
                </ContextContainer>
                {setupData?.hasCycles && (
                  <ContextContainer noFlex spacing={4}>
                    <Title className={classes.sectionTitle}>{'Cycles 🌎'}</Title>
                    <Controller
                      name="cycles"
                      control={control}
                      rules={{ required: 'Required field 🌎' }}
                      render={({ field }) => <CyclesSetup {...field} programCourses={courses} />}
                    />
                  </ContextContainer>
                )}
              </>
            )}
          </ContextContainer>
        )}

        {/* SECTION: GROUPS SETUP */}
        <ContextContainer direction="column" spacing={4}>
          <Title className={classes.title}>{'Configuración de Aulas 🌎'}</Title>
          <ContextContainer noFlex spacing={4}>
            {setupData?.referenceGroups && (
              <>
                <Title className={classes.sectionTitle}>{'Reference Groups 🌎'}</Title>
                <Controller
                  name="referenceGroups"
                  control={control}
                  rules={{ required: 'Required field 🌎' }}
                  render={({ field }) => (
                    <ReferenceGroupsSetup
                      {...field}
                      programCourses={courses}
                      coursesAreSequential={setupData?.sequentialCourses}
                    />
                  )}
                />
              </>
            )}
            <Controller
              name="seatsPerCourse"
              control={control}
              rules={{ required: 'Required field 🌎' }}
              render={({ field }) => <SeatsPerCourseSetup {...field} courses={courses} />}
            />
          </ContextContainer>
        </ContextContainer>

        {/* SECTION: OTHERS */}
        <ContextContainer sx={{ marginDown: 100 }} direction="column" spacing={4}>
          <Title className={classes.title}>{'Others 🌎'}</Title>
          <ContextContainer noFlex spacing={4}>
            <Title className={classes.sectionTitle}>{'Privacy 🌎'}</Title>
            <Controller
              name="hideStudentsFromEachOther"
              control={control}
              render={({ field: { value, ref, ...field } }) => (
                <Checkbox
                  checked={value || false}
                  {...field}
                  label={
                    'Los alumnos no pueden verse entre sí (esta opción deshabilita las opciones de chat entre alumnos) 🌎'
                  }
                />
              )}
            />
          </ContextContainer>
          <ContextContainer noFlex spacing={4}>
            <Title className={classes.sectionTitle}>{'Automatic assignment 🌎'}</Title>
            <Controller
              name="autoAsignment"
              control={control}
              render={({ field: { value, ref, ...field } }) => (
                <Checkbox
                  checked={value || false}
                  {...field}
                  label={
                    'Todos los nuevos alumnos matriculados en el programa son asignados automáticamente en todas las tareas previamente asignadas (podrás personalizarlo en cada asignación, pero esta será la opción por defecto). 🌎'
                  }
                />
              )}
            />
          </ContextContainer>
        </ContextContainer>
      </ContextContainer>
      <FooterContainer scrollRef={scrollRef}>
        <Stack justifyContent={'space-between'} fullWidth>
          <Button variant="outline" type="button" onClick={onCancel} loading={drawerIsLoading}>
            {'Cancel 🌎'}
          </Button>
          <Button type="submit">{'Create Program 🌎'}</Button>
        </Stack>
      </FooterContainer>
    </form>
  );
};

AddProgramForm.propTypes = {
  scrollRef: PropTypes.any,
  setupData: PropTypes.object,
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func,
  centerId: PropTypes.string,
  drawerIsLoading: PropTypes.bool,
};

export default AddProgramForm;

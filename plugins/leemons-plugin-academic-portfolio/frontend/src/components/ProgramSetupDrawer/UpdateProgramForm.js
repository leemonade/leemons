import React, { useEffect, useMemo } from 'react';
import { isEmpty } from 'lodash';
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
import ImagePicker from '@leebrary/components/ImagePicker';
import FooterContainer from './FooterContainer';

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

const UpdateProgramForm = ({
  scrollRef,
  onCancel,
  setupData,
  onSubmit,
  program,
  drawerIsLoading,
}) => {
  const { classes } = useAddProgramFormStyles();
  const form = useForm();
  const { control, formState, setValue, watch } = form;
  const { hoursPerCredit, credits } = watch();

  const totalHours = useMemo(() => {
    if (!credits || !hoursPerCredit) return null;
    return parseInt(hoursPerCredit) * parseInt(credits);
  }, [hoursPerCredit, credits]);

  useEffect(() => {
    if (!isEmpty(program)) {
      setValue('name', program.name);
      setValue('abbreviation', program.abbreviation);
      setValue('color', program.color);
      setValue('image', program.image);
      setValue('credits', program.credits);
      setValue('hoursPerCredit', program.hoursPerCredit);
      setValue('totalHours', program.totalHours);
      setValue('autoAssignment', program.useAutoAssignment);
    }
  }, [program]);

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <ContextContainer sx={{ marginBottom: 100 }} direction="column" spacing={8}>
        {/* SECTION: BASIC DATA */}
        <ContextContainer direction="column" spacing={4}>
          <Title className={classes.title}>{'Basic Data 🌎'}</Title>
          <ContextContainer noFlex spacing={6}>
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

          {/* DURACIÓN Y CRÉDITOS */}
          {(program?.credits || setupData?.totalHours) && (
            <ContextContainer noFlex spacing={6}>
              <Title className={classes.sectionTitle}>
                {program?.totalHours ? 'Duration 🌎' : 'Duration and Credits 🌎'}
              </Title>
              {program?.credits && (
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
                      rules={{ required: 'Required field 🌎' }}
                      control={control}
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
              {program?.totalHours && !program?.credits && (
                <Controller
                  name="totalHours"
                  control={control}
                  render={({ field }) => (
                    <NumberInput
                      {...field}
                      min={1}
                      label={'Durations (hours) 🌎'}
                      sx={{ width: 216 }}
                      placeholder={'Total hours 🌎'}
                    />
                  )}
                />
              )}
            </ContextContainer>
          )}
        </ContextContainer>

        <ContextContainer noFlex spacing={6}>
          <Title className={classes.sectionTitle}>{'Automatic assignment 🌎'}</Title>
          <Controller
            name="useAutoAssignment"
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

UpdateProgramForm.propTypes = {
  scrollRef: PropTypes.any,
  setupData: PropTypes.object,
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func,
  program: PropTypes.object,
  drawerIsLoading: PropTypes.bool,
};

export default UpdateProgramForm;

import React, { useEffect } from 'react';
import { isBoolean } from 'lodash';
import PropTypes from 'prop-types';

import {
  ContextContainer,
  RadioGroup,
  Title,
  createStyles,
  Stack,
  Button,
} from '@bubbles-ui/components';
import { Controller, useForm } from 'react-hook-form';
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

const FormSetup = ({ scrollRef, onCancel, onSetup }) => {
  const { classes } = useFormSetupStyles();
  const { watch, setValue, clearErrors, control, formState, handleSubmit } = useForm();
  const { moreThanOneCourse, sequentialCourses, creditsSystem } = watch();

  return (
    <ContextContainer direction="column" spacing={8}>
      <form onSubmit={handleSubmit(onSetup)}>
        <ContextContainer noFlex spacing={4}>
          <Title className={classes.title}>{'Personalización 🌎'}</Title>
          <ContextContainer noFlex alignItems="start">
            <Title className={classes.sectionTitle}>{'Estructura temporal 🌎'}</Title>
            <Controller
              name="moreThanOneCourse"
              control={control}
              rules={{ validate: (value) => isBoolean(value) || 'Campo requerido 🌎' }}
              render={({ field }) => (
                <RadioGroup
                  {...field}
                  label="¿Este programa tiene varios cursos? 🌎"
                  data={[
                    { label: 'Si 🌎', value: true },
                    { label: 'No 🌎', value: false },
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
                  rules={{ validate: (value) => isBoolean(value) || 'Campo requerido 🌎' }}
                  render={({ field }) => (
                    <RadioGroup
                      {...field}
                      label="¿Es necesario terminar un curso para comenzar el siguiente? 🌎"
                      data={[
                        { label: 'Si 🌎', value: true },
                        { label: 'No 🌎', value: false },
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
                  rules={{ validate: (value) => isBoolean(value) || 'Campo requerido 🌎' }}
                  render={({ field }) => (
                    <RadioGroup
                      {...field}
                      label="¿Se agrupan esos cursos en ciclos educativos? 🌎"
                      data={[
                        { label: 'Si 🌎', value: true },
                        { label: 'No 🌎', value: false },
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
              rules={{ validate: (value) => isBoolean(value) || 'Campo requerido 🌎' }}
              render={({ field }) => (
                <RadioGroup
                  {...field}
                  label="¿Hay subetapas de evaluación? (por ejemplo, trimestres o semestres) 🌎"
                  data={[
                    { label: 'Si 🌎', value: true },
                    { label: 'No 🌎', value: false },
                  ]}
                  error={formState.errors.hasSubstagesPerCourse}
                />
              )}
            />
          </ContextContainer>
          <ContextContainer noFlex alignItems="start">
            <Title className={classes.sectionTitle}>{'Asignaturas o grupos 🌎'}</Title>
            <Controller
              name="knowledgeAreas"
              control={control}
              rules={{ validate: (value) => isBoolean(value) || 'Campo requerido 🌎' }}
              render={({ field }) => (
                <RadioGroup
                  {...field}
                  label="¿Existen áreas de conocimiento que agrupen asignaturas? 🌎"
                  data={[
                    { label: 'Si 🌎', value: true },
                    { label: 'No 🌎', value: false },
                  ]}
                  error={formState.errors.knowledgeAreas}
                />
              )}
            />
            <Controller
              name="subjectTypes"
              control={control}
              rules={{ validate: (value) => isBoolean(value) || 'Campo requerido 🌎' }}
              render={({ field }) => (
                <RadioGroup
                  {...field}
                  label="¿Existen tipologías de asignaturas? (Troncal, Optativa, Libre configuración...) 🌎"
                  data={[
                    { label: 'Si 🌎', value: true },
                    { label: 'No 🌎', value: false },
                  ]}
                  error={formState.errors.subjectTypes}
                />
              )}
            />
            <Controller
              name="customSubjectIds"
              control={control}
              rules={{ validate: (value) => isBoolean(value) || 'Campo requerido 🌎' }}
              render={({ field }) => (
                <RadioGroup
                  {...field}
                  label="¿Necesitas establecer un ID (número de identificación) personalizado para cada asignatura? 🌎"
                  data={[
                    { label: 'Si 🌎', value: true },
                    { label: 'No 🌎', value: false },
                  ]}
                  error={formState.errors.customSubjectIds}
                />
              )}
            />
            <Controller
              name="referenceGroups"
              control={control}
              rules={{ validate: (value) => isBoolean(value) || 'Campo requerido 🌎' }}
              render={({ field }) => (
                <RadioGroup
                  {...field}
                  label="¿Necesitas crear Grupos de Referencia que compartan asignaturas? (por ejemplo, 2ºA, 2ºB...) 🌎"
                  data={[
                    { label: 'Si 🌎', value: true },
                    { label: 'No 🌎', value: false },
                  ]}
                  error={formState.errors.referenceGroups}
                />
              )}
            />
          </ContextContainer>
          <ContextContainer noFlex alignItems="start">
            <Title className={classes.sectionTitle}>{'Otros 🌎'}</Title>
            <Controller
              name="creditsSystem"
              control={control}
              rules={{ validate: (value) => isBoolean(value) || 'Campo requerido 🌎' }}
              render={({ field }) => (
                <RadioGroup
                  {...field}
                  label="¿Necesitas usar un sistema oficial de créditos? 🌎"
                  data={[
                    { label: 'Si 🌎', value: true },
                    { label: 'No 🌎', value: false },
                  ]}
                  error={formState.errors.creditsSystem}
                />
              )}
            />
            {!creditsSystem && isBoolean(creditsSystem) && (
              <Controller
                name="durationInHours"
                control={control}
                rules={{ validate: (value) => isBoolean(value) || 'Campo requerido 🌎' }}
                render={({ field }) => (
                  <RadioGroup
                    {...field}
                    label="¿Necesitas definir una duración total en horas para verificar el progreso? (sin créditos) 🌎"
                    data={[
                      { label: 'Si 🌎', value: true },
                      { label: 'No 🌎', value: false },
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
                {'Cancelar 🌎'}
              </Button>
              <Button type="submit">{'Guardar 🌎'}</Button>
            </Stack>
          </FooterContainer>
        </ContextContainer>
      </form>
    </ContextContainer>
  );
};

FormSetup.propTypes = {
  scrollRef: PropTypes.any,
  onCancel: PropTypes.func,
  onSetup: PropTypes.func,
};

export default FormSetup;

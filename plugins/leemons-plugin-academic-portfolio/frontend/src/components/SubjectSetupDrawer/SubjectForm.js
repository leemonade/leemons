import React, { useEffect, useMemo, useState } from 'react';
import { cloneDeep, isArray, isEmpty } from 'lodash';
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
  MultiSelect,
  Select,
  Switch,
} from '@bubbles-ui/components';
import ImagePicker from '@leebrary/components/ImagePicker';
import useKnowledgeAreas from '@academic-portfolio/hooks/useKnowledgeAreas';
import useSubjectTypes from '@academic-portfolio/hooks/useSubjectTypes';
import FooterContainer from '../ProgramSetupDrawer/FooterContainer';
import ClassroomsSetup from './ClassroomsSetup';
import ReferenceGroupsClassroomsSetup from './ReferenceGroupsClassroomsSetup';

const useSubjectFormStyles = createStyles((theme) => ({
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

const SubjectForm = ({
  scrollRef,
  isEditing,
  onCancel,
  program,
  onSubmit,
  drawerIsLoading,
  subject,
}) => {
  const { classes } = useSubjectFormStyles();
  const form = useForm();
  const { control, formState } = form;
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [disableReferenceGroups, setDisableReferenceGroups] = useState(false);
  const coursesFormValue = form.watch('courses');

  const programReferenceGroups = useMemo(
    () => program?.groups.filter((group) => group.name !== '-auto-'),
    [program]
  );

  function transformClassesData(classesData) {
    if (classesData.every((e) => e.groups)) {
      return classesData?.map((item) => ({
        referenceGroup: `${item.groups?.name}::${item.groups.id}`,
        classroomId: item?.classroomId,
        seats: item?.seats,
        course: isArray(item?.courses)
          ? item.courses.map((_course) => _course.id)
          : item.courses?.id,
        id: item?.id,
        alias: null,
      }));
    }
    setDisableReferenceGroups(true);
    return classesData.map(({ classroomId, seats, alias, id }) => ({
      classroomId,
      seats,
      alias,
      id,
    }));
  }

  // DATA FOR SELECT INPUTS ---------------------------------------------------------------------------------||

  // Knowledge Areas select
  const { data: knowledgeAreasQuery, isLoading: areKnowledgeAreasLoading } = useKnowledgeAreas({
    center: program?.centers[0],
    options: { enabled: program?.centers[0]?.length > 0 },
  });

  const knowledgeAreasSelectData = useMemo(() => {
    if (knowledgeAreasQuery?.length) {
      const knowledgeAreasForSelect = knowledgeAreasQuery.map((item) => ({
        label: item.name,
        value: item.id,
      }));
      return [...knowledgeAreasForSelect];
    }
    return [];
  }, [knowledgeAreasQuery]);

  // SubjectTypes select
  const { data: subjectTypesQuery, isLoading: areSubjectTypesLoading } = useSubjectTypes({
    center: program?.centers[0],
    options: { enabled: program?.centers[0]?.length > 0 },
  });

  const subjectTypesSelectData = useMemo(() => {
    if (subjectTypesQuery?.length) {
      const subjectTypesForSelect = subjectTypesQuery.map((item) => ({
        label: item.name,
        value: item.id,
      }));
      return [...subjectTypesForSelect];
    }
    return [];
  }, [subjectTypesQuery]);

  // Courses Select
  const coursesSelectData = useMemo(() => {
    if (!isEmpty(program)) {
      return program.courses.map((item) => ({ label: item.name, value: item.id }));
    }
    return [];
  }, [program]);

  // Substages Select
  const substagesSelectData = useMemo(() => {
    if (!isEmpty(program)) {
      return program.substages.map((item) => ({ label: item.name, value: item.id }));
    }
    return [];
  }, [program]);

  // Effects ---------------------------------------------------------------------------------||
  useEffect(() => {
    if (coursesFormValue?.length) {
      const newValue = program.courses.filter((course) => coursesFormValue.includes(course.id));
      setSelectedCourses(cloneDeep(newValue));
    }
  }, [coursesFormValue]);

  useEffect(() => {
    if (isEditing && subject) {
      const fields = ['name', 'internalId', 'color', 'image', 'icon', 'substage', 'credits'];
      fields.forEach((field) => {
        form.setValue(field, subject[field]);
      });

      form.setValue('subjectType', subject.subjectType?.id);
      form.setValue('knowledgeArea', subject.knowledgeArea?.id);

      const classrooms = transformClassesData(subject.classes);
      form.setValue('classrooms', classrooms);

      if (Array.isArray(subject.courses)) {
        form.setValue(
          'courses',
          subject.courses.map((course) => course.id)
        );
      } else if (subject.courses) {
        form.setValue('courses', subject.courses.id);
      }
    }
  }, [isEditing, subject]);

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <ContextContainer sx={{ marginBottom: 100 }} direction="column" spacing={8}>
        <Title className={classes.title}>{'Basic Data 🌎'}</Title>

        <ContextContainer noFlex spacing={6}>
          <Title className={classes.sectionTitle}>{'Presentation 🌎'}</Title>
          <Stack className={classes.horizontalInputsContainer}>
            <Controller
              name="name"
              control={control}
              rules={{ required: 'Required field 🌎' }}
              render={({ field }) => (
                <TextInput
                  {...field}
                  label={'Name 🌎'}
                  placeholder={'Name... 🌎'}
                  error={formState.errors.name}
                  required
                  sx={{ width: 216 }}
                />
              )}
            />
            {program?.useCustomSubjectIds && (
              <Controller
                name="internalId"
                control={control}
                rules={{
                  required: 'This field is required 🌎',
                  maxLength: { value: 3, message: 'ID must be a maximum of 3 digits 🌎' },
                  pattern: { value: /^[0-9]+$/, message: 'ID must be numeric 🌎' },
                }}
                render={({ field, fieldState }) => (
                  <TextInput
                    {...field}
                    label={'ID único (numérico, 3 digitos) 🌎'}
                    placeholder={'ID único  🌎'}
                    error={fieldState.error?.message}
                    required
                    sx={{ width: 232 }}
                    disabled={isEditing}
                  />
                )}
              />
            )}
            <Controller
              name="color"
              control={control}
              rules={{ required: 'Required field 🌎' }}
              render={({ field }) => (
                <ColorInput
                  {...field}
                  label={'Color 🌎'}
                  placeholder={'Color 🌎'}
                  useHsl
                  compact={false}
                  manual={false}
                  contentStyle={{ width: 200 }}
                  required
                />
              )}
            />
          </Stack>
          <Controller
            name="image"
            control={control}
            render={({ field }) => (
              <InputWrapper label="Image 🌎">
                <ImagePicker {...field} />
              </InputWrapper>
            )}
          />
          <Controller
            name="icon"
            control={control}
            render={({ field }) => (
              <InputWrapper label="Icon 🌎">
                <ImagePicker {...field} />
              </InputWrapper>
            )}
          />
        </ContextContainer>

        {(program?.hasKnowledgeAreas || program?.hasSubjectTypes || program?.credits) && (
          <ContextContainer noFlex spacing={6}>
            <Title className={classes.sectionTitle}>{'Características 🌎'}</Title>
            <Stack className={classes.horizontalInputsContainer}>
              {program?.hasKnowledgeAreas && (
                <Controller
                  name="knowledgeArea"
                  control={control}
                  rules={{
                    required: 'Required field 🌎',
                  }}
                  render={({ field, fieldState }) => (
                    <Select
                      {...field}
                      data={knowledgeAreasSelectData}
                      label={'Área de conocimiento 🌎'}
                      sx={{ width: 216 }}
                      placeholder={'Selecciona un área... 🌎'}
                      error={fieldState.error}
                      required
                    />
                  )}
                />
              )}
              {program?.hasSubjectTypes && (
                <Controller
                  name="subjectType"
                  control={control}
                  rules={{
                    required: 'Required field 🌎',
                  }}
                  render={({ field, fieldState }) => (
                    <Select
                      {...field}
                      data={subjectTypesSelectData}
                      label={'Tipo 🌎'}
                      sx={{ width: 216 }}
                      placeholder={'Selecciona un tipo...🌎'}
                      error={fieldState.error}
                      required
                    />
                  )}
                />
              )}
              {program?.credits && (
                <Controller
                  name="credits"
                  control={control}
                  rules={{
                    required: 'Required field 🌎',
                  }}
                  render={({ field, fieldState }) => (
                    <NumberInput
                      {...field}
                      label={'Nº de créditos 🌎'}
                      min={0}
                      sx={{ width: 216 }}
                      placeholder={'Créditos...🌎'}
                      error={fieldState.error}
                      required
                    />
                  )}
                />
              )}
            </Stack>
          </ContextContainer>
        )}

        <ContextContainer noFlex spacing={6}>
          <Title className={classes.sectionTitle}>{'Oferta 🌎'}</Title>
          <Stack className={classes.horizontalInputsContainer}>
            <Controller
              name="courses"
              control={control}
              rules={{
                required: 'Required field 🌎',
              }}
              render={({ field, fieldState }) => {
                if (program?.sequentialCourses) {
                  return (
                    <Select
                      {...field}
                      label={'Curso donde se ofrece 🌎'}
                      data={coursesSelectData}
                      sx={{ width: 216 }}
                      placeholder={'Elije uno o varios cursos...🌎'}
                      error={fieldState.error}
                      required
                      autoSelectOneOption
                    />
                  );
                }
                return (
                  <MultiSelect
                    {...field}
                    label={'Cursos donde se ofrece 🌎'}
                    data={coursesSelectData}
                    sx={{ width: 216 }}
                    placeholder={'Elije uno o varios cursos...🌎'}
                    error={fieldState.error}
                    required
                  />
                );
              }}
            />
            <Controller
              name="substage"
              control={control}
              rules={{
                required: 'Required field 🌎',
              }}
              render={({ field, fieldState }) => (
                <Select
                  {...field}
                  label={'Subetapa donde se ofrece 🌎'}
                  data={[{ label: 'Curso completo 🌎', value: 'all' }, ...substagesSelectData]}
                  sx={{ width: 216 }}
                  placeholder={'Subetapa...🌎'}
                  error={fieldState.error}
                  required
                  autoSelectOneOption
                />
              )}
            />
          </Stack>
        </ContextContainer>

        <ContextContainer noFlex spacing={4}>
          <Title className={classes.sectionTitle}>{'Configuración de Aulas 🌎'}</Title>
          <Controller
            name="classrooms"
            control={control}
            rules={{
              validate: (value) =>
                (Array.isArray(value) && value.length > 0) || 'At least one classroom is needed 🌎',
            }}
            render={({ field, fieldState }) => (
              <InputWrapper error={fieldState.error?.message}>
                {programReferenceGroups?.length ? (
                  <Stack direction="column" spacing={4}>
                    <Switch
                      label={'Esta asignatura no pertenece a un Grupo de Referencia 🌎'}
                      onChange={(val) => {
                        form.setValue('classrooms', []);
                        setDisableReferenceGroups(val);
                      }}
                      checked={disableReferenceGroups}
                    />
                    {disableReferenceGroups ? (
                      <ClassroomsSetup {...field} />
                    ) : (
                      <ReferenceGroupsClassroomsSetup
                        {...field}
                        groups={programReferenceGroups}
                        selectedCourses={selectedCourses}
                        isMultiCourse={!program?.sequentialCourses}
                        refGroupdisabled={!coursesFormValue?.length}
                      />
                    )}
                  </Stack>
                ) : (
                  <ClassroomsSetup {...field} />
                )}
              </InputWrapper>
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

SubjectForm.propTypes = {
  scrollRef: PropTypes.any,
  program: PropTypes.object,
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func,
  drawerIsLoading: PropTypes.bool,
  isEditing: PropTypes.bool,
  subject: PropTypes.object,
};

export default SubjectForm;

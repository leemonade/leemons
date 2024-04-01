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
  localizations,
}) => {
  const { classes } = useSubjectFormStyles();
  const form = useForm();
  const { control, formState } = form;
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [disableReferenceGroups, setDisableReferenceGroups] = useState(false);
  const coursesFormValue = form.watch('courses');

  const formLabels = useMemo(() => {
    if (!localizations) return {};
    return localizations?.drawer;
  }, [localizations]);

  const programReferenceGroups = useMemo(
    () => program?.groups.filter((group) => group.name !== '-auto-'), // Previous implementation, this check is not needed anymore. Reference groups = program.groups
    [program]
  );

  const subjectWithPeopleEnrolled = useMemo(() => {
    if (!isEmpty(subject)) {
      return subject.classes.some((classItem) => {
        const hasStudents = classItem.students?.length > 0;
        const hasTeachers = classItem.teachers?.length > 0;
        return hasStudents || hasTeachers;
      });
    }
    return false;
  }, [subject]);

  console.log('subjectWithPeopleEnrolled', subjectWithPeopleEnrolled);
  console.log('subject', subject);

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
  const { data: knowledgeAreasQuery } = useKnowledgeAreas({
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
  const { data: subjectTypesQuery } = useSubjectTypes({
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
        <Title className={classes.title}>{formLabels?.basicData?.title}</Title>

        <ContextContainer noFlex spacing={6}>
          <Title className={classes.sectionTitle}>{formLabels?.basicData?.presentation}</Title>
          <Stack className={classes.horizontalInputsContainer}>
            <Controller
              name="name"
              control={control}
              rules={{ required: formLabels?.requiredField }}
              render={({ field }) => (
                <TextInput
                  {...field}
                  label={formLabels?.basicData?.name}
                  placeholder={formLabels?.textPlaceholder}
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
                  required: formLabels?.requiredField,
                  maxLength: {
                    value: 3,
                    message: formLabels?.validation?.internalIdMaxLength,
                  },
                  pattern: {
                    value: /^[0-9]+$/,
                    message: formLabels?.validation?.internalIdFormat,
                  },
                }}
                render={({ field, fieldState }) => (
                  <TextInput
                    {...field}
                    label={formLabels?.basicData?.internalId}
                    placeholder={formLabels?.textPlaceholder}
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
              rules={{ required: formLabels?.requiredField }}
              render={({ field }) => (
                <ColorInput
                  {...field}
                  label={formLabels?.basicData?.color}
                  placeholder={'#000000'}
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
              <InputWrapper label={formLabels?.basicData?.featuredImage}>
                <ImagePicker {...field} />
              </InputWrapper>
            )}
          />
          <Controller
            name="icon"
            control={control}
            render={({ field }) => (
              <InputWrapper label={formLabels?.basicData?.icon}>
                <ImagePicker {...field} objectFit="contain" acceptedFileTypes={['image/svg+xml']} />
              </InputWrapper>
            )}
          />
        </ContextContainer>

        {(program?.hasKnowledgeAreas || program?.hasSubjectTypes || program?.credits) && (
          <ContextContainer noFlex spacing={6}>
            <Title className={classes.sectionTitle}>{formLabels?.features?.title}</Title>
            <Stack className={classes.horizontalInputsContainer}>
              {program?.hasKnowledgeAreas && (
                <Controller
                  name="knowledgeArea"
                  control={control}
                  rules={{
                    required: formLabels?.requiredField,
                  }}
                  render={({ field, fieldState }) => (
                    <Select
                      {...field}
                      data={knowledgeAreasSelectData}
                      label={formLabels?.features?.knowledgeArea}
                      sx={{ width: 216 }}
                      placeholder={formLabels?.features?.knowledgeAreaPlaceholder}
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
                    required: formLabels?.requiredField,
                  }}
                  render={({ field, fieldState }) => (
                    <Select
                      {...field}
                      data={subjectTypesSelectData}
                      label={formLabels?.features?.type}
                      sx={{ width: 216 }}
                      placeholder={formLabels?.features?.typePlaceholder}
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
                    required: formLabels?.requiredField,
                  }}
                  render={({ field, fieldState }) => (
                    <NumberInput
                      {...field}
                      label={formLabels?.features?.numberOfCredits}
                      min={0}
                      sx={{ width: 216 }}
                      placeholder={formLabels?.features?.numberOfCreditsPlaceholder}
                      error={fieldState.error}
                      required
                    />
                  )}
                />
              )}
            </Stack>
          </ContextContainer>
        )}

        {(!isEditing || (isEditing && !subjectWithPeopleEnrolled)) && (
          <>
            <ContextContainer noFlex spacing={6}>
              <Title className={classes.sectionTitle}>{formLabels?.offer?.title}</Title>
              <Stack className={classes.horizontalInputsContainer}>
                <Controller
                  name="courses"
                  control={control}
                  rules={{
                    required: formLabels?.requiredField,
                  }}
                  render={({ field, fieldState }) => {
                    if (program?.sequentialCourses) {
                      return (
                        <Select
                          {...field}
                          label={formLabels?.offer?.coursesWhereItIsOffered}
                          data={coursesSelectData}
                          sx={{ width: 216 }}
                          placeholder={formLabels?.offer?.coursesWhereItIsOfferedPlaceholder}
                          error={fieldState.error}
                          required
                          autoSelectOneOption
                        />
                      );
                    }
                    return (
                      <MultiSelect
                        {...field}
                        label={formLabels?.offer?.coursesWhereItIsOffered}
                        data={coursesSelectData}
                        sx={{ width: 216 }}
                        placeholder={formLabels?.offer?.coursesWhereItIsOfferedPlaceholder}
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
                    required: formLabels?.requiredField,
                  }}
                  render={({ field, fieldState }) => (
                    <Select
                      {...field}
                      label={formLabels?.offer?.substageWhereItIsOffered}
                      data={[
                        { label: localizations?.labels?.noSubstages, value: 'all' },
                        ...substagesSelectData,
                      ]}
                      sx={{ width: 216 }}
                      error={fieldState.error}
                      required
                      autoSelectOneOption
                      placeholder={formLabels?.offer?.substageWhereItIsOfferedPlaceholder}
                    />
                  )}
                />
              </Stack>
            </ContextContainer>

            <ContextContainer noFlex spacing={4}>
              <Title className={classes.sectionTitle}>{formLabels?.classroomsSetup?.title}</Title>
              <Controller
                name="classrooms"
                control={control}
                rules={{
                  validate: (value) =>
                    (Array.isArray(value) && value.length > 0) ||
                    formLabels?.validation?.atLeastOneClassroom,
                }}
                render={({ field, fieldState }) => (
                  <InputWrapper error={fieldState.error?.message}>
                    {programReferenceGroups?.length ? (
                      <Stack direction="column" spacing={4}>
                        <Switch
                          label={formLabels?.classroomsSetup?.disableReferenceGroups}
                          onChange={(val) => {
                            form.setValue('classrooms', []);
                            setDisableReferenceGroups(val);
                          }}
                          checked={disableReferenceGroups}
                        />
                        {disableReferenceGroups ? (
                          <ClassroomsSetup
                            {...field}
                            formLabels={{
                              ...formLabels?.classroomsSetup,
                              validation: { ...formLabels?.validation },
                              labels: { ...localizations?.labels },
                              textPlaceholder: formLabels.textPlaceholder,
                            }}
                          />
                        ) : (
                          <ReferenceGroupsClassroomsSetup
                            {...field}
                            groups={programReferenceGroups}
                            selectedCourses={selectedCourses}
                            isMultiCourse={!program?.sequentialCourses}
                            refGroupdisabled={!coursesFormValue?.length}
                            formLabels={{
                              ...formLabels?.classroomsSetup,
                              validation: { ...formLabels?.validation },
                              labels: { ...localizations?.labels },
                              textPlaceholder: formLabels.textPlaceholder,
                            }}
                          />
                        )}
                      </Stack>
                    ) : (
                      <ClassroomsSetup
                        {...field}
                        formLabels={{
                          ...formLabels?.classroomsSetup,
                          validation: { ...formLabels?.validation },
                          labels: { ...localizations?.labels },
                          textPlaceholder: formLabels.textPlaceholder,
                        }}
                      />
                    )}
                  </InputWrapper>
                )}
              />
            </ContextContainer>
          </>
        )}
      </ContextContainer>
      <FooterContainer scrollRef={scrollRef}>
        <Stack justifyContent={'space-between'} fullWidth>
          <Button variant="outline" type="button" onClick={onCancel}>
            {formLabels?.cancel}
          </Button>
          <Button type="submit" loading={drawerIsLoading}>
            {isEditing ? formLabels?.saveChanges : formLabels?.createSubject}
          </Button>
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
  localizations: PropTypes.object,
};

export default SubjectForm;

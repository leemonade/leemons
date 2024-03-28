import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Controller, useForm } from 'react-hook-form';
import { isEmpty, noop, omit } from 'lodash';
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
  localizations,
  programUnderEdit = {},
  onUpdate = noop,
}) => {
  const { classes } = useAddProgramFormStyles();
  const isEditing = useMemo(() => !isEmpty(programUnderEdit), [programUnderEdit]);
  const form = useForm();
  const { control, formState, setValue, watch } = form;
  const { hoursPerCredit, credits, courses } = watch();

  const totalHours = useMemo(() => {
    if (!credits || !hoursPerCredit) return null;
    return parseInt(hoursPerCredit) * parseInt(credits);
  }, [hoursPerCredit, credits]);

  const formLabels = useMemo(() => {
    if (!localizations) return {};
    return localizations?.programDrawer?.addProgramForm;
  }, [localizations]);

  const getSeats = () => {
    if (programUnderEdit.seatsForAllCourses) {
      return { all: programUnderEdit.seatsForAllCourses };
    }
    const result = {};
    programUnderEdit.courses?.forEach((course) => {
      result[course.index] = course.metadata.seats;
    });
    return result;
  };

  useEffect(() => {
    if (!isEmpty(programUnderEdit)) {
      setValue('name', programUnderEdit.name);
      setValue('abbreviation', programUnderEdit.abbreviation);
      setValue('color', programUnderEdit.color);
      setValue('image', programUnderEdit.image);
      setValue('evaluationSystem', programUnderEdit.evaluationSystem);
      setValue('hideStudentsFromEachOther', programUnderEdit.hideStudentsToStudents);
      setValue('autoAssignment', programUnderEdit.useAutoAssignment);

      setValue('seatsPerCourse', getSeats());

      if (setupData.creditsSystem) {
        setValue('credits', programUnderEdit.credits);
        setValue('hoursPerCredit', programUnderEdit.hoursPerCredit);
      }
      if (setupData.durationInHours) {
        setValue('totalHours', programUnderEdit.totalHours);
      }
      if (setupData.hasSubstages) {
        setValue('substages', programUnderEdit.substages);
      }
      if (setupData.hasCycles) {
        const formattedCycles = programUnderEdit.cycles?.map(
          ({ courses: _courses, name, index }) => {
            const coursesIndex = _courses?.map(
              (courseId) => programUnderEdit.courses.find((c) => c.id === courseId)?.index
            );
            return { name, courses: coursesIndex, index };
          }
        );
        setValue('cycles', formattedCycles);
      }

      if (setupData.referenceGroups) {
        const { groupsForAllCourses } = programUnderEdit.groupsMetadata;
        if (groupsForAllCourses) {
          setValue('referenceGroups', {
            ...omit(programUnderEdit.groupsMetadata, 'groupsForAllCourses'),
            groupsForCourse1: groupsForAllCourses,
          });
        } else {
          setValue('referenceGroups', programUnderEdit.groupsMetadata);
        }
      }

      const formattedCourses = programUnderEdit.courses?.map(({ index, metadata }) => ({
        ...metadata,
        index,
      }));
      setValue('courses', formattedCourses);
    }
  }, [programUnderEdit]);

  return (
    <form onSubmit={form.handleSubmit(isEditing ? onUpdate : onSubmit)}>
      <ContextContainer sx={{ marginBottom: 100 }} direction="column" spacing={8}>
        {/* SECTION: BASIC DATA */}
        <ContextContainer direction="column" spacing={4}>
          <Title className={classes.title}>{formLabels?.basicData?.title}</Title>
          <ContextContainer noFlex spacing={4}>
            <Title className={classes.sectionTitle}>{formLabels?.basicData?.presentation}</Title>
            <Stack className={classes.horizontalInputsContainer}>
              <Controller
                control={control}
                name="name"
                rules={{ required: localizations?.programDrawer?.requiredField }}
                render={({ field }) => (
                  <TextInput
                    {...field}
                    label={formLabels?.basicData?.name}
                    placeholder={formLabels?.basicData?.name}
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
                  required: localizations?.programDrawer?.requiredField,
                  maxLength: { value: 8, message: formLabels?.basicData?.validation?.abbreviation },
                }}
                render={({ field }) => (
                  <TextInput
                    {...field}
                    label={formLabels?.basicData?.abbreviation}
                    placeholder={formLabels?.basicData?.abbreviation}
                    error={formState.errors.abbreviation}
                    required
                    sx={{ width: 216 }}
                  />
                )}
              />
              <Controller
                control={control}
                name="color"
                rules={{ required: localizations?.programDrawer?.requiredField }}
                render={({ field }) => (
                  <ColorInput
                    {...field}
                    label={formLabels?.basicData?.color}
                    placeholder={formLabels?.basicData?.color}
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
                <InputWrapper label={formLabels?.basicData?.featuredImage}>
                  <ImagePicker {...field} />
                </InputWrapper>
              )}
            />
          </ContextContainer>

          {/* REGLAS ACADÉMICAS */}
          <ContextContainer noFlex spacing={4}>
            <Title className={classes.sectionTitle}>{formLabels?.academicRules?.title}</Title>
            <Controller
              name="evaluationSystem"
              control={control}
              rules={{
                required: localizations?.programDrawer?.requiredField,
              }}
              render={({ field, fieldState }) => (
                <EvaluationsSelect
                  {...field}
                  center={centerId}
                  sx={{ width: 216 }}
                  placeholder={formLabels?.academicRules?.selectSystem}
                  error={fieldState.error}
                />
              )}
            />
          </ContextContainer>

          {/* DURACIÓN Y CRÉDITOS */}
          {(setupData?.creditsSystem || setupData?.durationInHours) && (
            <ContextContainer noFlex spacing={4}>
              <Title className={classes.sectionTitle}>
                {setupData?.durationInHours
                  ? formLabels?.durationAndCredits?.titleOnlyDuration
                  : formLabels?.durationAndCredits?.titleWithCredits}
              </Title>
              {setupData?.creditsSystem && (
                <Stack className={classes.horizontalInputsContainer}>
                  <Stack className={classes.horizontalInputsContainer}>
                    <Controller
                      name="hoursPerCredit"
                      control={control}
                      rules={{ required: localizations?.programDrawer?.requiredField }}
                      render={({ field, fieldState }) => (
                        <NumberInput
                          {...field}
                          min={1}
                          label={formLabels?.durationAndCredits?.hoursPerCredit}
                          sx={{ width: 216 }}
                          error={fieldState.error?.message}
                          placeholder={formLabels?.durationAndCredits?.hoursPlaceholder}
                        />
                      )}
                    />
                    <Controller
                      name="credits"
                      control={control}
                      rules={{ required: localizations?.programDrawer?.requiredField }}
                      render={({ field, fieldState }) => (
                        <NumberInput
                          {...field}
                          label={formLabels?.durationAndCredits?.numberOfCredits}
                          min={1}
                          sx={{ width: 216 }}
                          error={fieldState.error?.message}
                          placeholder={formLabels?.durationAndCredits?.totalCreditsPlaceholder}
                        />
                      )}
                    />
                  </Stack>
                  <Text sx={{ alignSelf: 'end', padding: 12 }}>
                    {totalHours
                      ? `${totalHours} ${formLabels?.durationAndCredits?.totalHours}`
                      : ''}
                  </Text>
                </Stack>
              )}
              {setupData?.durationInHours && (
                <Controller
                  name="totalHours"
                  control={control}
                  rules={{ required: localizations?.programDrawer?.requiredField }}
                  render={({ field, fieldState }) => (
                    <NumberInput
                      {...field}
                      min={1}
                      label={formLabels?.durationAndCredits?.durationInHours}
                      sx={{ width: 216 }}
                      placeholder={formLabels?.durationAndCredits?.totalHoursPlaceholder}
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
            <Title className={classes.title}>{formLabels?.temporalStructure?.title}</Title>
            {setupData?.hasSubstages && (
              <ContextContainer noFlex spacing={4}>
                <Title className={classes.sectionTitle}>
                  {formLabels?.temporalStructure?.courseSubstages}
                </Title>
                <Controller
                  name="substages"
                  control={control}
                  rules={{ required: localizations?.programDrawer?.requiredField }}
                  render={({ field }) => (
                    <InputWrapper error={formState.errors.substages}>
                      <SubstagesSetup {...field} localizations={localizations} />
                    </InputWrapper>
                  )}
                />
              </ContextContainer>
            )}
            {setupData?.moreThanOneCourse && (
              <>
                <ContextContainer noFlex spacing={4}>
                  <Title className={classes.sectionTitle}>
                    {formLabels?.temporalStructure?.courses}
                  </Title>
                  <Controller
                    name="courses"
                    control={control}
                    rules={{ required: localizations?.programDrawer?.requiredField }}
                    render={({ field }) => (
                      <CoursesSetup
                        {...field}
                        showCredits={!!setupData?.creditsSystem}
                        maxNumberOfCredits={parseInt(credits) || 0}
                        onChange={(data) => {
                          setValue('courses', data);
                        }}
                        localizations={localizations}
                      />
                    )}
                  />
                </ContextContainer>
                {setupData?.hasCycles && (
                  <ContextContainer noFlex spacing={4}>
                    <Title className={classes.sectionTitle}>
                      {formLabels?.temporalStructure?.cycles}
                    </Title>
                    <Controller
                      name="cycles"
                      control={control}
                      rules={{ required: localizations?.programDrawer?.requiredField }}
                      render={({ field }) => (
                        <CyclesSetup
                          {...field}
                          programCourses={courses}
                          localizations={localizations}
                        />
                      )}
                    />
                  </ContextContainer>
                )}
              </>
            )}
          </ContextContainer>
        )}

        {/* SECTION: GROUPS SETUP */}
        {setupData?.referenceGroups && (
          <ContextContainer direction="column" spacing={4}>
            <Title className={classes.title}>{formLabels?.classConfiguration}</Title>
            <ContextContainer noFlex spacing={4}>
              <>
                <Title className={classes.sectionTitle}>{formLabels?.referenceGroups}</Title>
                <Controller
                  name="referenceGroups"
                  control={control}
                  rules={{ required: localizations?.programDrawer?.requiredField }}
                  render={({ field }) => (
                    <ReferenceGroupsSetup
                      {...field}
                      programCourses={courses}
                      coursesAreSequential={setupData?.sequentialCourses}
                      localizations={localizations}
                    />
                  )}
                />
              </>

              <Controller
                name="seatsPerCourse"
                control={control}
                rules={{ required: localizations?.programDrawer?.requiredField }}
                render={({ field }) => (
                  <SeatsPerCourseSetup
                    {...field}
                    courses={courses}
                    localizations={localizations}
                    sequentialCourses={setupData?.sequentialCourses}
                  />
                )}
              />
            </ContextContainer>
          </ContextContainer>
        )}

        {/* SECTION: OTHERS */}
        <ContextContainer sx={{ marginDown: 100 }} direction="column" spacing={4}>
          <Title className={classes.title}>{localizations?.programDrawer?.others}</Title>
          <ContextContainer noFlex spacing={4}>
            <Title className={classes.sectionTitle}>{formLabels?.privacy}</Title>
            <Controller
              name="hideStudentsFromEachOther"
              control={control}
              render={({ field: { value, ref, ...field } }) => (
                <Checkbox
                  checked={value || false}
                  {...field}
                  label={formLabels?.hideStudentsFromEachOther}
                />
              )}
            />
          </ContextContainer>
          <ContextContainer noFlex spacing={4}>
            <Title className={classes.sectionTitle}>{formLabels?.automaticAssignment}</Title>
            <Controller
              name="autoAssignment"
              control={control}
              render={({ field: { value, ref, ...field } }) => (
                <Checkbox
                  checked={value || false}
                  {...field}
                  label={formLabels?.autoAssignmentDescription}
                />
              )}
            />
          </ContextContainer>
        </ContextContainer>
      </ContextContainer>
      <FooterContainer scrollRef={scrollRef}>
        <Stack justifyContent={'space-between'} fullWidth>
          <Button variant="outline" type="button" onClick={onCancel} loading={drawerIsLoading}>
            {formLabels?.cancel}
          </Button>
          <Button type="submit">{formLabels?.createProgram}</Button>
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
  onUpdate: PropTypes.func,
  centerId: PropTypes.string,
  drawerIsLoading: PropTypes.bool,
  localizations: PropTypes.object.isRequired,
  programUnderEdit: PropTypes.object,
};

export default AddProgramForm;

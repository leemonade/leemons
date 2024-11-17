import { useCallback, useEffect, useMemo, useState } from 'react';
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
  Tooltip,
  TotalLayoutStepContainer,
  TotalLayoutContainer,
} from '@bubbles-ui/components';
import { InfoIcon } from '@bubbles-ui/icons/solid';
import { useLocale } from '@common/LocaleDate';
import { Header } from '@leebrary/components/AssetPickerDrawer/components/Header';
import ImagePicker from '@leebrary/components/ImagePicker';
import { cloneDeep, isEmpty, noop, omit } from 'lodash';
import PropTypes from 'prop-types';

import CoursesSetup from './CoursesSetup';
import CyclesSetup from './CyclesSetup';
import EvaluationSystemsSelect from './EvaluationSystemSelect';
import FooterContainer from './FooterContainer';
import LoadingFormState from './LoadingFormState';
import Nomenclature from './Nomenclature';
import ProgramStaff from './ProgramStaff';
import ReferenceGroupsSetup from './ReferenceGroupsSetup';
import SeatsPerCourseSetup from './SeatsPerCourseSetup';
import SubstagesSetup from './SubstagesSetup';

import getTranslationKeyPrefixes from '@academic-portfolio/helpers/getTranslationKeyPrefixes';
import useSetProgramCustomTranslationKeys from '@academic-portfolio/hooks/mutations/useSetProgramCustomTranslationKeys';

function updateProgressWithLoadingCheck(setProgress, isLoading, onLoadingComplete) {
  const minDisplayTime = 2700; // Minimum display time
  const startTime = Date.now();
  let intervalId;

  setProgress(15);

  const incrementProgressAfterLoad = () => {
    setProgress(30); // Initial load after fetching data
    intervalId = setInterval(() => {
      setProgress((prevProgress) => {
        const updatedProgress = prevProgress + 2;
        if (updatedProgress >= 100) {
          clearInterval(intervalId);

          const elapsedTime = Date.now() - startTime;
          const remainingTime = minDisplayTime - elapsedTime;
          if (remainingTime > 0) {
            setTimeout(onLoadingComplete, remainingTime);
          } else {
            onLoadingComplete();
          }
        }
        return updatedProgress;
      });
    }, 50);
  };

  if (!isLoading) {
    incrementProgressAfterLoad();
  }

  return () => {
    clearInterval(intervalId);
  };
}

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
  programBeingEdited,
  onUpdate = noop,
  setNomenclature = noop,
}) => {
  const { classes } = useAddProgramFormStyles();
  const isEditing = useMemo(() => !isEmpty(programBeingEdited), [programBeingEdited]);
  const form = useForm();
  const [loadingEvaluationSystems, setLoadingEvaluationSystems] = useState(false);
  const [showLoadingComponent, setShowLoadingComponent] = useState(!isEditing);
  const [progress, setProgress] = useState(0);
  const [staffValidationLoading, setStaffValidationLoading] = useState(false);
  const { mutate: setProgramCustomTranslationKeys } = useSetProgramCustomTranslationKeys({
    successMessage:
      localizations?.programDrawer?.addProgramForm?.formLabels?.nomenclature?.success?.set,
  });
  const userLocale = useLocale();

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

  const getSeats = useCallback(() => {
    if (programBeingEdited.seatsForAllCourses) {
      return { all: programBeingEdited.seatsForAllCourses };
    }
    const result = {};
    programBeingEdited.courses?.forEach((course) => {
      result[course.index] = course.metadata.seats;
    });
    return result;
  }, [programBeingEdited]);

  // EFFECTS ··························································································||ﬂG

  useEffect(() => {
    if (isEmpty(programBeingEdited)) {
      const handleLoadingComplete = () => {
        setShowLoadingComponent(false);
      };

      return updateProgressWithLoadingCheck(
        setProgress,
        loadingEvaluationSystems,
        handleLoadingComplete
      );
    }
    return () => {};
  }, [loadingEvaluationSystems, programBeingEdited]);

  useEffect(() => {
    if (!isEmpty(programBeingEdited) && !isEmpty(setupData)) {
      setValue('name', programBeingEdited.name);
      setValue('abbreviation', programBeingEdited.abbreviation);
      setValue('color', programBeingEdited.color);
      setValue('image', programBeingEdited.image);
      setValue('evaluationSystem', programBeingEdited.evaluationSystem);
      setValue('hideStudentsFromEachOther', programBeingEdited.hideStudentsToStudents);
      setValue('autoAssignment', programBeingEdited.useAutoAssignment);

      setValue('seatsPerCourse', getSeats());

      if (setupData.creditsSystem) {
        setValue('credits', programBeingEdited.credits);
        setValue('hoursPerCredit', programBeingEdited.hoursPerCredit);
      }
      if (setupData.durationInHours) {
        setValue('totalHours', programBeingEdited.totalHours);
      }
      if (setupData.hasSubstages) {
        setValue('substages', programBeingEdited.substages);
      }
      if (setupData.hasCycles) {
        const formattedCycles = programBeingEdited.cycles?.map(
          ({ courses: _courses, name, index }) => {
            const coursesIndex = _courses?.map(
              (courseId) => programBeingEdited.courses.find((c) => c.id === courseId)?.index
            );
            return { name, courses: coursesIndex, index };
          }
        );
        setValue('cycles', formattedCycles);
      }

      if (setupData.referenceGroups) {
        const { groupsForAllCourses } = programBeingEdited.groupsMetadata;
        if (groupsForAllCourses) {
          setValue('referenceGroups', {
            ...omit(programBeingEdited.groupsMetadata, 'groupsForAllCourses'),
            groupsForCourse1: groupsForAllCourses,
          });
        } else {
          setValue('referenceGroups', programBeingEdited.groupsMetadata);
        }
      }

      const formattedCourses = programBeingEdited.courses?.map(({ index, metadata }) => ({
        ...metadata,
        index,
      }));
      setValue('courses', formattedCourses);

      setValue('nomenclature', programBeingEdited.nomenclature);

      if (programBeingEdited.staff) {
        Object.entries(programBeingEdited.staff).forEach(([role, staffData]) => {
          setValue(`staff.${role}`, staffData);
        });
      }
    }
  }, [programBeingEdited, getSeats]);

  // HANDLERS ··························································································||ﬂG

  const handleOnSubmit = (data) => {
    const nomenclature = form.getValues('nomenclature');
    const cleanNomenclature = {};
    if (nomenclature.block) cleanNomenclature.block = nomenclature.block;
    if (nomenclature.subject) cleanNomenclature.subject = nomenclature.subject;

    const localeCustomKeys = {
      [userLocale]: cleanNomenclature,
    };

    if (isEditing) {
      if (!isEmpty(cleanNomenclature)) {
        setProgramCustomTranslationKeys({
          programId: programBeingEdited.id,
          prefix: getTranslationKeyPrefixes().PROGRAM,
          localizations: localeCustomKeys,
        });
      }
      onUpdate(data);
    } else {
      onSubmit(data);
    }
  };

  return (
    <TotalLayoutContainer
      clean
      scrollRef={scrollRef}
      Header={
        <Header
          localizations={{
            title: !isEditing
              ? localizations?.programDrawer.title
              : localizations?.programDrawer.updateTitle,
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
          background: showLoadingComponent && '#F8F9FB',
        }}
      >
        <TotalLayoutStepContainer clean>
          {showLoadingComponent ? (
            <LoadingFormState
              key="load-form"
              description={localizations?.programDrawer?.loadingForm}
              progress={progress}
            />
          ) : (
            <form onSubmit={form.handleSubmit(handleOnSubmit)}>
              <ContextContainer sx={{ marginBottom: 100 }} direction="column" spacing={8}>
                {/* SECTION: BASIC DATA */}
                <ContextContainer direction="column" spacing={4}>
                  <Title className={classes.title}>{formLabels?.basicData?.title}</Title>
                  <ContextContainer noFlex spacing={4}>
                    <Title className={classes.sectionTitle}>
                      {formLabels?.basicData?.presentation}
                    </Title>
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
                          maxLength: {
                            value: 8,
                            message: formLabels?.basicData?.validation?.abbreviation,
                          },
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
                            placeholder={'#000000'}
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

                  {/* STAFF */}
                  <ProgramStaff
                    control={control}
                    localizations={formLabels?.staff}
                    isEditing={isEditing}
                    programId={programBeingEdited?.id}
                    loading={staffValidationLoading}
                    setLoading={setStaffValidationLoading}
                  />

                  {/* REGLAS ACADÉMICAS */}
                  <ContextContainer noFlex spacing={4}>
                    <Title className={classes.sectionTitle}>
                      {formLabels?.academicRules?.title}
                    </Title>
                    <Controller
                      name="evaluationSystem"
                      control={control}
                      rules={{
                        required: localizations?.programDrawer?.requiredField,
                      }}
                      render={({ field, fieldState }) => (
                        <EvaluationSystemsSelect
                          {...field}
                          centerId={centerId}
                          sx={{ width: 216 }}
                          placeholder={formLabels?.academicRules?.selectSystem}
                          error={fieldState.error}
                          setLoadingEvaluationSystems={setLoadingEvaluationSystems}
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
                                  placeholder={formLabels?.durationAndCredits?.hoursPlaceholder}
                                  sx={{ width: 216 }}
                                  error={fieldState.error?.message}
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
                                  placeholder={
                                    formLabels?.durationAndCredits?.totalCreditsPlaceholder
                                  }
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
                      <Stack spacing={3} alignItems="center">
                        <Title className={classes.sectionTitle}>
                          {formLabels?.referenceGroups}
                        </Title>
                        <Tooltip
                          autoHeight
                          size="md"
                          multiline
                          width={250}
                          label={formLabels?.referenceGroupsInfo}
                        >
                          <Stack>
                            <InfoIcon width={24} height={24} />
                          </Stack>
                        </Tooltip>
                      </Stack>
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

                {/* SECTION: NOMENCLATURE */}
                <Nomenclature
                  labels={formLabels?.nomenclature}
                  onSaveTranslations={(payload) => setNomenclature(cloneDeep(payload))}
                  programId={programBeingEdited?.id || null}
                  form={form}
                />

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
                  {/* Auto assignment unabled until this functionality is implemented */}
                  {/* <ContextContainer noFlex spacing={4}>
                    <Title className={classes.sectionTitle}>
                      {formLabels?.automaticAssignment}
                    </Title>
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
                   */}
                </ContextContainer>
              </ContextContainer>
              <FooterContainer scrollRef={scrollRef}>
                <Stack justifyContent={'space-between'} fullWidth>
                  <Button variant="outline" type="button" onClick={onCancel}>
                    {formLabels?.cancel}
                  </Button>
                  <Button type="submit" loading={drawerIsLoading || staffValidationLoading}>
                    {isEmpty(programBeingEdited)
                      ? formLabels?.createProgram
                      : formLabels?.saveChanges}
                  </Button>
                </Stack>
              </FooterContainer>
            </form>
          )}
        </TotalLayoutStepContainer>
      </Stack>
    </TotalLayoutContainer>
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
  programBeingEdited: PropTypes.object,
  onLoadingStateChange: PropTypes.func,
  setNomenclature: PropTypes.func,
};

export default AddProgramForm;

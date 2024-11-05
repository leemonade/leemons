import { useEffect, useMemo, useState } from 'react';
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
  Table,
  TotalLayoutStepContainer,
  TotalLayoutContainer,
  Loader,
} from '@bubbles-ui/components';
import { useLocale } from '@common/LocaleDate';
import useProgramEvaluationSystems from '@grades/hooks/queries/useProgramEvaluationSystem';
import { Header } from '@leebrary/components/AssetPickerDrawer/components/Header';
import ImagePicker from '@leebrary/components/ImagePicker';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';

import ReadOnlyField from '../common/ReadOnlyField';

import FooterContainer from './FooterContainer';
import Nomenclature from './Nomenclature';
import ProgramStaff from './ProgramStaff';

import getTranslationKeyPrefixes from '@academic-portfolio/helpers/getTranslationKeyPrefixes';
import useSetProgramCustomTranslationKeys from '@academic-portfolio/hooks/mutations/useSetProgramCustomTranslationKeys';

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
  onSubmit,
  program,
  drawerIsLoading,
  localizations,
}) => {
  const [staffValidationLoading, setStaffValidationLoading] = useState(false);
  const { classes } = useAddProgramFormStyles();
  const form = useForm();
  const { control, formState, setValue, watch } = form;
  const { hoursPerCredit, credits } = watch();
  const userLocale = useLocale();
  const { mutate: setProgramCustomTranslationKeys } = useSetProgramCustomTranslationKeys({
    successMessage:
      localizations?.programDrawer?.addProgramForm?.formLabels?.nomenclature?.success?.set,
  });

  const totalHours = useMemo(() => {
    if (!credits || !hoursPerCredit) return null;
    return parseInt(hoursPerCredit) * parseInt(credits);
  }, [hoursPerCredit, credits]);

  const formLabels = useMemo(() => {
    if (!localizations) return {};
    return localizations?.programDrawer?.addProgramForm;
  }, [localizations]);

  const { data: programEvaluationSystem, isLoading } = useProgramEvaluationSystems({
    program: program?.id,
    options: { enabled: program?.id?.length > 0 },
  });

  useEffect(() => {
    if (!isEmpty(program)) {
      setValue('name', program.name);
      setValue('abbreviation', program.abbreviation);
      setValue('color', program.color);
      setValue('image', program.image);
      setValue('useAutoAssignment', program.useAutoAssignment);
      setValue('totalHours', program.totalHours);
      setValue('nomenclature', program.nomenclature ?? { block: '', subject: '' });
      if (program.staff) {
        Object.entries(program.staff).forEach(([role, staffData]) => {
          setValue(`staff.${role}`, staffData);
        });
      }
    }
  }, [program, setValue]);

  const readOnlySubstagesColumns = [
    { Header: ' ', accessor: 'index' },
    { Header: ' ', accessor: 'name' },
  ];

  const readOnlyCoursesAndCreditsColumns = [
    { Header: localizations?.labels.course, accessor: 'index' },
    {
      Header: localizations?.programDrawer?.addProgramForm.coursesSetup.minCredits,
      accessor: 'minCredits',
    },
    {
      Header: localizations?.programDrawer?.addProgramForm.coursesSetup.maxCredits,
      accessor: 'maxCredits',
    },
  ];

  const readOnlyCoursesAndGroupsColumns = [
    { Header: localizations?.labels.course, accessor: 'index' },

    {
      Header: localizations?.programDrawer?.addProgramForm.referenceGroupsSetup.numberOfGroups,
      accessor: 'amountOfGroups',
    },
    {
      Header: localizations?.programDrawer?.addProgramForm?.referenceGroupsSetup.nameFormat,
      accessor: 'groups',
    },
    ...(!program?.seatsForAllCourses && !isEmpty(program?.groupsMetadata)
      ? [
          {
            Header: localizations?.programDrawer?.addProgramForm.seatsPerCourseSetup.numberOfSeats,
            accessor: 'seats',
          },
        ]
      : []),
  ];

  const readOnlyCyclesColumns = [
    { Header: ' ', accessor: 'index' },
    { Header: ' ', accessor: 'name' },
    {
      Header: ' ',
      accessor: 'courses',
      valueRender: (crsArray) =>
        program?.courses
          ?.filter((crs) => crsArray.includes(crs.id))
          .map((c) => c.index)
          .join('º, '),
    },
  ];

  // HANDLERS ··························································································||ﬂG

  const handleOnSubmit = (data) => {
    const nomenclature = form.getValues('nomenclature');
    const cleanNomenclature = {};
    if (nomenclature.block) cleanNomenclature.block = nomenclature.block;
    if (nomenclature.subject) cleanNomenclature.subject = nomenclature.subject;

    const localeCustomKeys = {
      [userLocale]: cleanNomenclature,
    };

    if (!isEmpty(nomenclature)) {
      setProgramCustomTranslationKeys({
        programId: program.id,
        prefix: getTranslationKeyPrefixes().PROGRAM,
        localizations: localeCustomKeys,
      });
    }
    onSubmit(data);
  };

  if (isLoading) {
    return (
      <Stack fullHeight>
        <Loader padded />
      </Stack>
    );
  }

  return (
    <TotalLayoutContainer
      clean
      scrollRef={scrollRef}
      Header={
        <Header
          localizations={{
            title: localizations?.programDrawer.updateTitle,
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
        }}
      >
        <TotalLayoutStepContainer clean>
          <form onSubmit={form.handleSubmit(handleOnSubmit)}>
            <ContextContainer sx={{ marginBottom: 100 }} direction="column" spacing={6}>
              {/* SECTION: BASIC DATA */}
              <ContextContainer direction="column" spacing={4}>
                <Title className={classes.title}>{formLabels?.basicData?.title}</Title>
                <ContextContainer noFlex spacing={6}>
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
                  isEditing={true}
                  programId={program?.id}
                  loading={staffValidationLoading}
                  setLoading={setStaffValidationLoading}
                />

                {/* REGLAS ACADÉMICAS */}
                <ContextContainer noFlex spacing={4}>
                  <Title className={classes.sectionTitle}>{formLabels?.academicRules?.title}</Title>
                  <ReadOnlyField value={programEvaluationSystem?.name ?? ''} />
                </ContextContainer>

                {/* DURACIÓN Y CRÉDITOS */}
                {(program?.credits || program?.totalHours) && (
                  <ContextContainer noFlex spacing={6}>
                    <Title className={classes.sectionTitle}>
                      {program?.durationInHours
                        ? formLabels?.durationAndCredits?.titleOnlyDuration
                        : formLabels?.durationAndCredits?.titleWithCredits}
                    </Title>
                    {program?.credits && (
                      <Stack className={classes.horizontalInputsContainer}>
                        <Stack className={classes.horizontalInputsContainer}>
                          <ReadOnlyField
                            value={program?.hoursPerCredit}
                            label={formLabels?.durationAndCredits?.hoursPerCredit}
                          />
                          <ReadOnlyField
                            value={program?.credits}
                            label={formLabels?.durationAndCredits?.numberOfCredits}
                          />
                        </Stack>
                        <Text sx={{ alignSelf: 'end', padding: 12 }}>
                          {totalHours
                            ? `${totalHours} ${formLabels?.durationAndCredits?.totalHours}`
                            : ''}
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
                            label={formLabels?.durationAndCredits?.durationInHours}
                            sx={{ width: 216 }}
                            placeholder={formLabels?.durationAndCredits?.totalHoursPlaceholder}
                          />
                        )}
                      />
                    )}
                  </ContextContainer>
                )}
              </ContextContainer>

              {(program?.substages?.length > 0 || program?.courses?.length > 0) && (
                <ContextContainer direction="column" spacing={4}>
                  <Title className={classes.title}>{formLabels?.temporalStructure?.title}</Title>
                  {program?.substages?.length > 0 && (
                    <ContextContainer noFlex spacing={4}>
                      <Title className={classes.sectionTitle}>
                        {formLabels?.temporalStructure?.courseSubstages}
                      </Title>
                      <Table data={program?.substages || []} columns={readOnlySubstagesColumns} />
                    </ContextContainer>
                  )}
                  <ContextContainer noFlex spacing={4}>
                    <Title className={classes.sectionTitle}>
                      {formLabels?.temporalStructure?.courses}
                    </Title>
                    {program.credits ? (
                      <Table
                        data={(program?.courses ?? []).map((crs) => ({
                          ...crs,
                          minCredits: crs.metadata?.minCredits || '-',
                          maxCredits: crs.metadata?.maxCredits || '-',
                        }))}
                        columns={readOnlyCoursesAndCreditsColumns}
                      />
                    ) : (
                      <ReadOnlyField
                        label={
                          localizations?.programDrawer?.addProgramForm?.coursesSetup
                            ?.numberOfCourses
                        }
                        value={program?.courses?.length ?? 1}
                      />
                    )}
                  </ContextContainer>
                  {program?.cycles?.length > 0 && (
                    <ContextContainer noFlex spacing={4}>
                      <Title className={classes.sectionTitle}>
                        {formLabels?.temporalStructure?.cycles}
                      </Title>
                      <Table data={program?.cycles || []} columns={readOnlyCyclesColumns} />
                    </ContextContainer>
                  )}
                </ContextContainer>
              )}

              {program?.groups?.length > 0 && (
                <ContextContainer direction="column" spacing={4}>
                  <Title className={classes.title}>{formLabels?.classConfiguration}</Title>
                  <ContextContainer noFlex spacing={4}>
                    <Title className={classes.sectionTitle}>
                      <Title className={classes.sectionTitle}>{formLabels?.referenceGroups}</Title>
                    </Title>
                    <ReadOnlyField
                      label={
                        localizations?.programDrawer?.addProgramForm?.referenceGroupsSetup
                          .nameFormat
                      }
                      value={
                        localizations?.programDrawer?.addProgramForm?.referenceGroupsSetup
                          .nameFormatOptions[program?.groupsMetadata?.nameFormat]
                      }
                    />
                    <Table
                      data={(program?.courses ?? []).map((crs) => ({
                        ...crs,
                        seats: crs.metadata?.seats,
                        amountOfGroups: program?.groups?.filter(
                          (group) => group?.metadata?.course === crs.index
                        ).length,
                        groups: program?.groups
                          ?.filter((group) => group?.metadata?.course === crs.index)
                          .map((group) => group.name)
                          .sort()
                          .join(', '),
                      }))}
                      columns={readOnlyCoursesAndGroupsColumns}
                    />

                    <Title sx={(theme) => theme.other.score.content.typo.lg}>
                      {
                        localizations?.programDrawer?.addProgramForm?.seatsPerCourseSetup
                          .offeredSeats
                      }
                    </Title>

                    {program?.seatsForAllCourses ? (
                      <ReadOnlyField
                        label={
                          localizations?.programDrawer?.addProgramForm?.seatsPerCourseSetup
                            ?.numberOfSeats
                        }
                        value={program?.seatsForAllCourses}
                      />
                    ) : (
                      <ReadOnlyField
                        label={localizations?.labels?.info}
                        value={
                          localizations?.programDrawer?.addProgramForm?.seatsPerCourseSetup
                            .seatsVaryByCourse
                        }
                      />
                    )}
                  </ContextContainer>
                </ContextContainer>
              )}

              {/* SECTION: NOMENCLATURE */}
              <ContextContainer direction="column" spacing={4}>
                <Nomenclature
                  labels={formLabels?.nomenclature}
                  programId={program?.id}
                  form={form}
                />
              </ContextContainer>

              <ContextContainer noFlex spacing={4}>
                <Title className={classes.title}>{localizations?.programDrawer?.others}</Title>
                <ContextContainer noFlex spacing={4}>
                  <Title className={classes.sectionTitle}>{formLabels?.privacy}</Title>
                  <Checkbox
                    checked={program?.hideStudentsToStudents}
                    label={formLabels?.hideStudentsFromEachOther}
                    disabled
                  />
                  {/* Auto assignment unabled until this functionality is implemented */}
                  {/* <Title className={classes.sectionTitle}>{formLabels?.automaticAssignment}</Title>
                  <Controller
                    name="useAutoAssignment"
                    control={control}
                    render={({ field: { value, ref, ...field } }) => (
                      <Checkbox
                        checked={value || false}
                        {...field}
                        label={formLabels?.autoAssignmentDescription}
                      />
                    )}
                  /> */}
                </ContextContainer>
              </ContextContainer>
            </ContextContainer>

            <FooterContainer scrollRef={scrollRef}>
              <Stack justifyContent={'space-between'} fullWidth>
                <Button variant="outline" type="button" onClick={onCancel}>
                  {formLabels?.cancel}
                </Button>
                <Button type="submit" loading={drawerIsLoading || staffValidationLoading}>
                  {formLabels?.saveChanges}
                </Button>
              </Stack>
            </FooterContainer>
          </form>
        </TotalLayoutStepContainer>
      </Stack>
    </TotalLayoutContainer>
  );
};

UpdateProgramForm.propTypes = {
  scrollRef: PropTypes.any,
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func,
  program: PropTypes.object,
  drawerIsLoading: PropTypes.bool,
  localizations: PropTypes.object,
};

export default UpdateProgramForm;

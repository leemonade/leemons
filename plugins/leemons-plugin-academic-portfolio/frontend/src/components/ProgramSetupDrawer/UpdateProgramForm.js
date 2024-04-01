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
  TotalLayoutStepContainer,
  TotalLayoutContainer,
} from '@bubbles-ui/components';
import ImagePicker from '@leebrary/components/ImagePicker';
import { Header } from '@leebrary/components/AssetPickerDrawer/components/Header';
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
  localizations,
}) => {
  const { classes } = useAddProgramFormStyles();
  const form = useForm();
  const { control, formState, setValue, watch } = form;
  const { hoursPerCredit, credits } = watch();

  const totalHours = useMemo(() => {
    if (!credits || !hoursPerCredit) return null;
    return parseInt(hoursPerCredit) * parseInt(credits);
  }, [hoursPerCredit, credits]);

  const formLabels = useMemo(() => {
    if (!localizations) return {};
    return localizations?.programDrawer?.addProgramForm;
  }, [localizations]);

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
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <ContextContainer sx={{ marginBottom: 100 }} direction="column" spacing={8}>
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

                {/* DURACIÓN Y CRÉDITOS */}
                {(program?.credits || setupData?.totalHours) && (
                  <ContextContainer noFlex spacing={6}>
                    <Title className={classes.sectionTitle}>
                      {setupData?.durationInHours
                        ? formLabels?.durationAndCredits?.titleOnlyDuration
                        : formLabels?.durationAndCredits?.titleWithCredits}
                    </Title>
                    {program?.credits && (
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
                            rules={{ required: localizations?.programDrawer?.requiredField }}
                            control={control}
                            render={({ field, fieldState }) => (
                              <NumberInput
                                {...field}
                                label={formLabels?.durationAndCredits?.numberOfCredits}
                                min={1}
                                sx={{ width: 216 }}
                                placeholder={
                                  formLabels?.durationAndCredits?.totalCreditsPlaceholder
                                }
                                error={fieldState.error?.message}
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

              <ContextContainer noFlex spacing={6}>
                <Title className={classes.title}>{localizations?.programDrawer?.others}</Title>
                <Title className={classes.sectionTitle}>{formLabels?.automaticAssignment}</Title>
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
                />
              </ContextContainer>
              <ContextContainer noFlex spacing={6}>
                <Text role="productive" color="soft">
                  {
                    'Updating options are limited when a program has a history of subjects (active or archived). 🌎'
                  }
                </Text>
              </ContextContainer>
            </ContextContainer>

            <FooterContainer scrollRef={scrollRef}>
              <Stack justifyContent={'space-between'} fullWidth>
                <Button variant="outline" type="button" onClick={onCancel}>
                  {formLabels?.cancel}
                </Button>
                <Button type="submit" loading={drawerIsLoading}>
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
  setupData: PropTypes.object,
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func,
  program: PropTypes.object,
  drawerIsLoading: PropTypes.bool,
  localizations: PropTypes.object,
};

export default UpdateProgramForm;

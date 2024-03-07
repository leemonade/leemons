import React from 'react';
import PropTypes from 'prop-types';
import { Switch, DatePicker, Box, createStyles } from '@bubbles-ui/components';
import { TextEditorInput, HEADINGS_TOOL_DEFAULT_PROPS } from '@bubbles-ui/editors';
import ConditionalInput from '@tasks/components/Inputs/ConditionalInput';
import { useForm, Controller, useWatch, useFormContext } from 'react-hook-form';
import { Container } from '../Container';

function useOnChange({ control, onChange }) {
  const {
    useTeacherDeadline,
    teacherDeadline,
    notifyStudents,
    message,
    hideResponses,
    hideReport,
  } = useWatch({
    control,
  });

  React.useEffect(() => {
    const messageHasContent = message && message !== '<p style="margin-left: 0px!important;"></p>';
    const value = {
      hideReport: !!hideReport,
      hideResponses: !!hideResponses,
      notifyStudents: !!notifyStudents,

      useTeacherDeadline: !!useTeacherDeadline,
      teacherDeadline: useTeacherDeadline ? teacherDeadline ?? null : null,
      message: notifyStudents && messageHasContent ? message : null,
    };

    onChange?.(value);
  }, [useTeacherDeadline, teacherDeadline, notifyStudents, message, hideResponses, hideReport]);
}

export const useOtherOptionsStyles = createStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.other.global.spacing.padding.sm,
  },
  inlineContent: {
    display: 'inline-block',
  },
  textEditor: {
    maxWidth: 800,
  },
}));

export function OtherOptions({
  localizations,
  showReport,
  showResponses,
  showMessageForStudents,
  hideSectionHeaders,
  onChange,
  value,
}) {
  // const { control: parentControl } = useFormContext();

  const { control } = useForm({
    defaultValues: value,
  });

  // const alwaysAvailable = useWatch({
  //   control: parentControl,
  //   name: 'dates.alwaysAvailable',
  //   defaultValue: false,
  // });
  // const deadline = useWatch({
  //   control: parentControl,
  //   name: 'dates.dates.deadline',
  // });

  useOnChange({ control, onChange });

  const { classes } = useOtherOptionsStyles();
  return (
    <Container title={localizations?.title} hideDivider hideSectionHeaders={hideSectionHeaders}>
      <Box className={classes.root}>
        {/* TODO: Make teacher deadline work, and then include it on the assignation */}
        {/* {!alwaysAvailable && (
          <Controller
            name="useTeacherDeadline"
            control={control}
            shouldUnregister
            render={({ field: useTeacherDeadlineField }) => (
              <ConditionalInput
                {...useTeacherDeadlineField}
                label={localizations?.teacherDeadline}
                showOnTrue
                render={() => (
                  <Controller
                    name="teacherDeadline"
                    control={control}
                    render={({ field }) => (
                      <Box className={classes.inlineContent}>
                        <DatePicker
                          label={localizations?.teacherDeadlineInput?.label}
                          placeholder={localizations?.teacherDeadlineInput?.placeholder}
                          error={
                            error && !field.value && localizations?.teacherDeadlineInput?.error
                          }
                          minDate={deadline ?? new Date()}
                          {...field}
                          withTime
                        />
                      </Box>
                    )}
                  />
                )}
              />
            )}
          />
        )} */}
        {!!showMessageForStudents && (
          <Controller
            name="notifyStudents"
            control={control}
            render={({ field: notifyStudentsField }) => (
              <ConditionalInput
                {...notifyStudentsField}
                label={localizations?.notifyStudents}
                showOnTrue
                render={() => (
                  <Controller
                    name="message"
                    control={control}
                    render={({ field }) => (
                      <Box className={classes.textEditor}>
                        <TextEditorInput
                          {...field}
                          toolLabels={{
                            headingsTool: { ...HEADINGS_TOOL_DEFAULT_PROPS?.labels, label: '' },
                          }}
                          label={localizations?.messageForStudents}
                        />
                      </Box>
                    )}
                  />
                )}
              />
            )}
          />
        )}

        {!!showResponses && (
          <Controller
            name="hideResponses"
            control={control}
            shouldUnregister
            render={({ field }) => (
              <Switch {...field} checked={field.value} label={localizations?.hideResponses} />
            )}
          />
        )}
        {!!showReport && (
          <Controller
            name="hideReport"
            control={control}
            shouldUnregister
            render={({ field }) => (
              <Switch {...field} checked={field.value} label={localizations?.hideReport} />
            )}
          />
        )}
      </Box>
    </Container>
  );
}

OtherOptions.propTypes = {
  localizations: PropTypes.object,
  showReport: PropTypes.bool,
  showResponses: PropTypes.bool,
  showMessageForStudents: PropTypes.bool,
  hideSectionHeaders: PropTypes.bool,
  value: PropTypes.object,
  onChange: PropTypes.func,
  error: PropTypes.any,
};

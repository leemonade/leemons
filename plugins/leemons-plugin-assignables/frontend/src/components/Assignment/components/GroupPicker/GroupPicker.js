import { useForm, useWatch } from 'react-hook-form';

import { useAcademicProfiles } from '@academic-portfolio/hooks';
import { Box, createStyles, Alert } from '@bubbles-ui/components';
import PropTypes from 'prop-types';

import { useGroupedClassesWithSelectedSubjects } from '../../AssignStudents/hooks';
import { Container } from '../Container';

import { SelectClass } from './SelectClass';
import { SelectCustomGroup } from './SelectCustomGroup';
import SelectSingleStudent from './SelectSingleStudent';

const useGroupPickerStyles = createStyles((theme) => ({
  inline: {
    display: 'inline-block',
  },
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.other.global.spacing.gap.lg,
  },
  classSelector: {
    width: '50%',
  },
}));

export function GroupPicker({ onChange, value, localizations, error, hideSectionHeaders }) {
  const { control } = useForm({
    defaultValues: {
      type: value?.type || 'class',
    },
  });

  const groupedClassesWithSelectedSubjects = useGroupedClassesWithSelectedSubjects();

  const assignationType = useWatch({
    control,
    name: 'type',
  });

  // const optionsData = React.useMemo(
  //   () => [
  //     {
  //       value: 'class',
  //       label: localizations?.options?.class,
  //     },
  //     {
  //       value: 'customGroup',
  //       label: localizations?.options?.customGroup,
  //     },
  //     {
  //       value: 'singleStudent',
  //       label: localizations?.options?.singleStudent,
  //     },
  //   ],
  //   [localizations?.options]
  // );

  const { student: studentProfile } = useAcademicProfiles();

  const { classes } = useGroupPickerStyles();

  if (
    groupedClassesWithSelectedSubjects &&
    !groupedClassesWithSelectedSubjects?.assignableStudents?.length
  ) {
    return (
      <Container spacingBottom={16}>
        <Box className={classes.inline}>
          <Alert severity="error" closeable={false}>
            {localizations?.noStudentsError}
          </Alert>
        </Box>
      </Container>
    );
  }

  return (
    <Container title={localizations?.title} description={localizations?.subtitle} required>
      <Box className={classes.root}>
        {/* <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <Box className={classes.classSelector}>
              <Select {...field} data={optionsData} label={localizations?.classSelectLabel} />
            </Box>
          )}
        /> */}
        <Box>
          {assignationType === 'class' && (
            <SelectClass
              groupedClassesWithSelectedSubjects={groupedClassesWithSelectedSubjects}
              localizations={localizations?.class}
              studentProfile={studentProfile}
              error={error}
              onChange={onChange}
              value={value}
            />
          )}
          {assignationType === 'customGroup' && (
            <SelectCustomGroup
              localizations={localizations?.customGroup}
              groupedClassesWithSelectedSubjects={groupedClassesWithSelectedSubjects}
              studentProfile={studentProfile}
              error={error}
              onChange={onChange}
              value={value}
            />
          )}
          {assignationType === 'singleStudent' && (
            <SelectSingleStudent
              localizations={localizations?.singleStudent}
              groupedClassesWithSelectedSubjects={groupedClassesWithSelectedSubjects}
              studentProfile={studentProfile}
              error={error}
              onChange={onChange}
              value={value}
            />
          )}
        </Box>
      </Box>
    </Container>
  );
}

GroupPicker.propTypes = {
  localizations: PropTypes.object,
  onChange: PropTypes.func,
  value: PropTypes.array,
  error: PropTypes.any,
  hideSectionHeaders: PropTypes.bool,
};

export default GroupPicker;

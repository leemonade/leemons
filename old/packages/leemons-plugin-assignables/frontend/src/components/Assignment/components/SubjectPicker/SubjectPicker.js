import React from 'react';
import PropTypes from 'prop-types';
import { Box, MultiSelect, createStyles, Select } from '@bubbles-ui/components';
import { useSessionClasses, useSubjectDetails } from '@academic-portfolio/hooks';
import { map, uniqBy } from 'lodash';
import { Container } from '../Container';

export const useSubjectPickerStyles = createStyles(() => ({
  subjectPicker: { maxWidth: 543 },
}));

export function useSubjectsForSubjectPicker(subjects) {
  // EN: If no subject is provides on the assignable, fetch all the users subjects
  // ES: Si no hay asignaturas en el asignable, pedimos todas las asignaturas del usuario
  const { data: classes } = useSessionClasses({}, { enabled: !subjects?.length });

  const subjectsIds = React.useMemo(() => {
    if (subjects?.length) {
      return subjects?.map(({ subject }) => subject);
    }

    return classes?.map((klass) => klass.subject.id) || [];
  }, [subjects, classes]);

  const { data: subjectDetails } = useSubjectDetails(subjectsIds, {
    enabled: !!subjectsIds?.length,
  });

  return React.useMemo(
    () =>
      uniqBy(
        subjectDetails?.map((subject) => ({
          label: subject.name,
          value: subject.id,
          // icon: prepareAsset(subject.icon).cover,
        })),
        'value'
      ) || [],
    [subjectDetails]
  );
}

export function SubjectPicker({
  assignable,
  localizations,
  value,
  onChange,
  error,
  hideSectionHeaders,
  onlyOneSubject,
  ...props
}) {
  const subjects = useSubjectsForSubjectPicker(assignable?.subjects);
  const { classes } = useSubjectPickerStyles();

  const isFirstSubjectsLoad = React.useRef(true);

  React.useEffect(() => {
    isFirstSubjectsLoad.current = true;
  }, [assignable?.subjects]);

  React.useEffect(() => {
    if (isFirstSubjectsLoad.current && subjects?.length) {
      if (assignable?.subjects?.length) {
        const values = map(subjects, 'value');
        onChange(onlyOneSubject ? [values?.[0]] : values);
      }
      isFirstSubjectsLoad.current = false;
    }
  }, [subjects]);

  return (
    <Container title={localizations?.title} hideSectionHeaders={hideSectionHeaders}>
      <Box className={classes.subjectPicker}>
        {onlyOneSubject ? (
          <Select
            {...props}
            label={localizations?.subjectInput?.label}
            placeholder={localizations?.subjectInput?.placeholder}
            data={subjects}
            onChange={(data) => onChange([data])}
            error={error && localizations?.subjectInput?.error}
            value={value?.[0]}
            searchable
          />
        ) : (
          <MultiSelect
            {...props}
            label={localizations?.subjectInput?.label}
            placeholder={localizations?.subjectInput?.placeholder}
            canAddNewSuggestions={false}
            data={subjects}
            onChange={onChange}
            error={error && localizations?.subjectInput?.error}
            value={value}
          />
        )}
      </Box>
    </Container>
  );
}

SubjectPicker.propTypes = {
  localizations: PropTypes.object,
  assignable: PropTypes.object,
  onChange: PropTypes.func,
  value: PropTypes.arrayOf(PropTypes.string),
  error: PropTypes.any,
  hideSectionHeaders: PropTypes.bool,
  onlyOneSubject: PropTypes.bool,
};

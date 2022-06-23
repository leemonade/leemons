import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Box, createStyles, DrawerPush, Loader, Text } from '@bubbles-ui/components';

import { PluginScoresBasicIcon } from '@bubbles-ui/icons/outline';
import { ScoresPeriodForm } from '@bubbles-ui/leemons';
import { useUserCenters } from '@users/hooks';
import { useCenterPrograms, useProgramDetail } from '@academic-portfolio/hooks';
import useSubjectClasses from '@academic-portfolio/hooks/useSubjectClasses';
import { getCentersWithToken } from '@users/session';

const useStyle = createStyles((theme, { isOpened }) => ({
  drawer: {
    height: '100vh',
    padding: isOpened && 32,
    paddingLeft: isOpened && 48,
    borderRight: isOpened && `1px solid ${theme.colors.ui01}`,
  },
  drawerTitle: {
    marginBottom: 34,
    '*': {
      color: theme.colors.text04,
    },
  },
  titleTop: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  drawerText: {
    display: 'block',
    marginBottom: 48,
    lineHeight: '22.4px',
  },

  formTitle: {
    display: 'block',
    marginBottom: 24,
  },
}));

export default function PeriodSelector({
  opened,
  size = 370,
  fixed = true,
  allowCreate,
  periods,
  onPeriodSave,
  locale,
  fields = {},
  requiredFields = [],
}) {
  const { classes } = useStyle({ isOpened: opened });

  const [center, setCenter] = React.useState(null);
  const [program, setProgram] = React.useState(null);
  const [course, setCourse] = React.useState(null);
  const [subject, setSubject] = React.useState(null);

  const labels = {
    startDate: 'Start date',
    endDate: 'End date',
    submit: 'Search',
    newPeriod: 'New period',
    addPeriod: 'Add new period',
    shareWithTeachers: 'Share with teachers',
    saveButton: 'Save time period',
    periodName: 'Nombre',
  };

  const errorMessages = {
    startDate: 'Required start date',
    endDate: 'Required end date',
    validateStartDate: 'Start date is greater than end date',
    validateEndDate: 'End date is smaller than start date',
  };

  const { data: centers, isLoading: isLoadingCenters } = useUserCenters({
    enabled: fields.center === 'all',
  });

  const { data: programs } = useCenterPrograms(center, { enabled: fields.program && !!center });
  const { data: programData } = useProgramDetail(program, {
    enabled: (fields.course || fields.subject) && !!program,
  });
  const { data: apClasses } = useSubjectClasses(subject, { enabled: fields.group && !!subject });

  const fieldsToUse = useMemo(() => {
    const fieldsToReturn = [];

    if (fields.center === 'all') {
      fieldsToReturn.push({
        name: 'center',
        label: 'Center',
        placeholder: 'Select center',
        disabled: !centers?.length,
        data: (centers || []).map(({ id, name }) => ({ label: name, value: id })),
        required: requiredFields.includes('center'),
      });
    } else {
      const centersWithToken = getCentersWithToken();
      if (centersWithToken.length > 1) {
        fieldsToReturn.push({
          name: 'center',
          label: 'Center',
          placeholder: 'Select center',
          disabled: !centersWithToken.length,
          data: centersWithToken.map(({ id, name }) => ({ label: name, value: id })),
          required: requiredFields.includes('center'),
        });
      } else if (centersWithToken[0].id !== center) {
        setCenter(centersWithToken[0].id);
      }
    }

    if (fields.program) {
      fieldsToReturn.push({
        name: 'program',
        label: 'Program',
        placeholder: 'Select program',
        disabled: !center || !programs?.length,
        data: (programs || []).map(({ name, id }) => ({
          label: name,
          value: id,
        })),
        required: requiredFields.includes('program'),
      });
    }

    const couseIsRequired =
      requiredFields.includes('course') && !programData?.moreThanOneAcademicYear;
    if (fields.course) {
      fieldsToReturn.push({
        name: 'course',
        label: 'Course',
        placeholder: 'Select course',
        disabled: !program || !programData?.courses?.length,
        data: (programData?.courses || []).map(({ name, index, id }) => ({
          label: name || index,
          value: id,
        })),
        required: couseIsRequired,
      });
    }

    const subjects = (programData?.subjects || [])
      .filter(({ course: subjectCourse }) => subjectCourse === course || !course)
      .map(({ name, id }) => ({
        label: name,
        value: id,
      }));

    if (fields.subject) {
      fieldsToReturn.push({
        name: 'subject',
        label: 'Subject',
        placeholder: 'Select subject',
        disabled: (couseIsRequired && !course) || !subjects?.length,
        data: subjects,
        required: requiredFields.includes('subject'),
      });
    }

    if (fields.group) {
      fieldsToReturn.push({
        name: 'group',
        label: 'Group',
        placeholder: 'Select group',
        disabled: !subject || !apClasses?.length || !course || !subjects?.length,
        data: (apClasses || []).map(({ groups, id }) => ({
          label: groups.name,
          value: id,
        })),
        required: requiredFields.includes('group'),
      });
    }

    return fieldsToReturn;
  }, [fields, centers, programs, programData, center, course, subject, apClasses]);

  if (isLoadingCenters) {
    return <Loader />;
  }

  return (
    <DrawerPush opened={opened} size={size} fixed={fixed}>
      <Box className={classes.drawer}>
        <Box className={classes.drawerTitle}>
          <Box className={classes.titleTop}>
            <PluginScoresBasicIcon width={16} height={16} />
            <Text size="md">Scores</Text>
          </Box>
          <Text size="md" style={{ marginLeft: 24 }} strong>
            Scores Basic (admin)
          </Text>
        </Box>
        <Text className={classes.drawerText} role="productive">
          Scores allow you to rating grading and non-grading task and attendance control. Select the
          program and class, then you can filter by time periods, you can save these periods so that
          teachers can use them as evaluation stages.
        </Text>
        <Text
          className={classes.formTitle}
          role="productive"
          strong
          color="soft"
          size="xs"
          transform="uppercase"
        >
          Search period
        </Text>
        <ScoresPeriodForm
          labels={labels}
          errorMessages={errorMessages}
          fields={fieldsToUse}
          allowCreate={allowCreate}
          periods={periods?.filter((period) => {
            if (period.center !== center || period.program !== program) {
              return false;
            }

            if (period.course && period.course !== course) {
              return false;
            }

            return true;
          })}
          onSave={onPeriodSave}
          onChange={(v) => {
            if (v.center !== center) {
              setCenter(v.center);
              setProgram(null);
              setCourse(null);
              setSubject(null);
            }
            if (v.program !== program) {
              setProgram(v.program);
              setCourse(null);
              setSubject(null);
            }

            if (v.course !== course) {
              setCourse(v.course);
              setSubject(null);
            }

            if (v.subject !== subject) {
              setSubject(v.subject);
            }
          }}
          locale={locale}
        />
      </Box>
    </DrawerPush>
  );
}

PeriodSelector.propTypes = {
  opened: PropTypes.bool,
  size: PropTypes.number,
  fixed: PropTypes.bool,
  allowCreate: PropTypes.bool,
  periods: PropTypes.array,
  onPeriodSave: PropTypes.func,
  locale: PropTypes.string,
  fields: PropTypes.object,
  requiredFields: PropTypes.array,
};

import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Box, createStyles, DrawerPush, Loader, Text } from '@bubbles-ui/components';

import { PluginScoresBasicIcon } from '@bubbles-ui/icons/outline';
import { ScoresPeriodForm } from '@bubbles-ui/leemons';
import { useUserCenters } from '@users/hooks';
import { useCenterPrograms, useProgramDetail } from '@academic-portfolio/hooks';
import { getCentersWithToken } from '@users/session';

import _, { isFunction, uniqBy } from 'lodash';
import { unflatten } from '@common';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { prefixPN } from '@scores/helpers';
import useSessionClasses from '@academic-portfolio/hooks/useSessionClasses';

const useStyle = createStyles((theme, { isOpened }) => ({
  drawer: {
    height: '100vh',
    padding: isOpened && theme.spacing[7],
    paddingLeft: isOpened && theme.spacing[10],
    borderRight: isOpened && `1px solid ${theme.colors.ui01}`,
    marginBottom: theme.spacing[7],
  },
  drawerTitle: {
    marginBottom: theme.spacing[7],
    '*': {
      color: theme.colors.text04,
    },
  },
  titleTop: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing[2],
  },
  drawerText: {
    display: 'block',
    marginBottom: theme.spacing[10],
    lineHeight: '22.4px',
  },

  formTitle: {
    display: 'block',
    marginBottom: theme.spacing[5],
  },
  form: {
    paddingBottom: theme.spacing[7] * 2,
  },
}));

function getMostSpecificPeriod(filters, periods) {
  const periodsWithSpecificity = periods
    .filter(
      (period) =>
        period.startDate.getTime() === filters.startDate.getTime() &&
        period.endDate.getTime() === filters.endDate.getTime()
    )
    .map((period) => {
      // eslint-disable-next-line no-shadow
      let specificity = 0;
      if (filters.center === period.center) {
        specificity += 1;
      }
      if (filters.program === period.program) {
        specificity += 1;
      }
      if (filters.course === period.course) {
        specificity += 1;
      }

      return { ...period, specificity };
    });

  const mostSpecificPeriod = _.maxBy(periodsWithSpecificity, 'specificity');

  return _.omit(mostSpecificPeriod, 'specificity');
}

export default function PeriodSelector({
  opened,
  size = 370,
  fixed = true,
  allowCreate,
  periods,
  onPeriodSave,
  onPeriodSubmit,
  onPeriodChange,
  locale,
  fields = {},
  requiredFields = [],
}) {
  const { classes } = useStyle({ isOpened: opened });

  const [center, setCenter] = React.useState(null);
  const [allowCenterChange, setAllowCenterChange] = React.useState(true);
  const [program, setProgram] = React.useState(null);
  const [course, setCourse] = React.useState(null);
  const [subject, setSubject] = React.useState(null);

  const [, translations] = useTranslateLoader([
    prefixPN('periods.periodForm'),
    prefixPN('periods.periodFormErrorMessages'),
    prefixPN(allowCreate ? 'periods.adminDrawer' : 'periods.teacherDrawer'),
  ]);

  const { errorMessages, ...labels } = useMemo(() => {
    if (translations && translations.items) {
      const res = unflatten(translations.items);

      return {
        form: _.get(res, prefixPN('periods.periodForm')),
        drawer: _.get(res, prefixPN(allowCreate ? 'periods.adminDrawer' : 'periods.teacherDrawer')),
        errorMessages: _.get(res, prefixPN('periods.periodFormErrorMessages')),
      };
    }

    return {};
  }, [translations]);

  const { data: centers, isLoading: isLoadingCenters } = useUserCenters({
    enabled: fields.center === 'all',
  });

  const { data: programs } = useCenterPrograms(center, { enabled: fields.program && !!center });
  const { data: programData } = useProgramDetail(program, {
    enabled: (fields.course || fields.subject) && !!program,
  });
  const { data: teacherClasses } = useSessionClasses({ program }, { enabled: !!program });

  const fieldsToUse = useMemo(() => {
    const fieldsToReturn = [];

    if (fields.center === 'all') {
      fieldsToReturn.push({
        name: 'center',
        label: labels?.form?.center?.label,
        placeholder: labels?.form?.center?.placeholder,
        disabled: !centers?.length,
        data: (centers || []).map(({ id, name }) => ({ label: name, value: id })),
        required: requiredFields.includes('center') && labels?.form?.center?.error,
      });
      setAllowCenterChange(true);
    } else {
      const centersWithToken = getCentersWithToken();
      if (centersWithToken.length > 1) {
        fieldsToReturn.push({
          name: 'center',
          label: labels?.form?.center?.label,
          placeholder: labels?.form?.center?.placeholder,
          disabled: !centersWithToken.length,
          data: centersWithToken.map(({ id, name }) => ({ label: name, value: id })),
          required: requiredFields.includes('center') && labels?.form?.center?.error,
        });
        setAllowCenterChange(true);
      } else if (centersWithToken[0].id !== center) {
        setCenter(centersWithToken[0].id);
        setAllowCenterChange(false);
      }
    }

    if (fields.program) {
      fieldsToReturn.push({
        name: 'program',
        label: labels?.form?.program?.label,
        placeholder: labels?.form?.program?.placeholder,
        disabled: !center || !programs?.length,
        data: (programs || []).map(({ name, id }) => ({
          label: name,
          value: id,
        })),
        required: requiredFields.includes('program') && labels?.form?.program?.error,
      });
    }

    const courseIsRequired =
      requiredFields.includes('course') && !programData?.moreThanOneAcademicYear;

    if (fields.course) {
      fieldsToReturn.push({
        name: 'course',
        label: labels?.form?.course?.label,
        placeholder: labels?.form?.course?.placeholder,
        disabled: !program || !programData?.courses?.length,
        data: (programData?.courses || []).map(({ name, index, id }) => ({
          label: name || index,
          value: id,
        })),
        required: courseIsRequired && labels?.form?.course?.error,
      });
    }

    const subjects = uniqBy(
      (teacherClasses || [])
        .map((d) => d.subject)
        .filter(({ course: subjectCourse }) => subjectCourse === course || !course)
        .map(({ name, id, subject: sid }) => ({
          label: name,
          value: sid || id,
        })),
      'value'
    );

    if (fields.subject) {
      fieldsToReturn.push({
        name: 'subject',
        label: labels?.form?.subject?.label,
        placeholder: labels?.form?.subject?.placeholder,
        disabled: (courseIsRequired && !course) || !subjects?.length,
        data: subjects,
        required: requiredFields.includes('subject') && labels?.form?.subject?.error,
      });
    }

    if (fields.group) {
      const groups = uniqBy(
        (teacherClasses || [])
          .filter((d) => d.subject.id === subject || d.subject.subject === subject)
          .map(({ groups: g }) => ({
            label: g.name,
            value: g.id,
          })),
        'value'
      );

      fieldsToReturn.push({
        name: 'group',
        label: labels?.form?.group?.label,
        placeholder: labels?.form?.group?.placeholder,
        disabled: !subject || !groups?.length || (!course && courseIsRequired) || !subjects?.length,
        data: groups,
        required: requiredFields.includes('group') && labels?.form?.group?.error,
      });
    }

    return fieldsToReturn;
  }, [fields, centers, programs, programData, center, course, subject, teacherClasses]);

  if (isLoadingCenters) {
    return <Loader />;
  }

  return (
    <DrawerPush opened={opened} size={size} fixed={fixed}>
      <Box className={classes.drawer}>
        <Box className={classes.drawerTitle}>
          <Box className={classes.titleTop}>
            <PluginScoresBasicIcon width={16} height={16} />
            <Text size="md">{labels?.drawer?.title}</Text>
          </Box>
          {/* <Text size="md" style={{ marginLeft: 24 }} strong>
            Scores Basic (admin)
          </Text> */}
        </Box>
        <Text className={classes.drawerText} role="productive">
          {labels?.drawer?.description}
        </Text>
        <Text
          className={classes.formTitle}
          role="productive"
          strong
          color="soft"
          size="xs"
          transform="uppercase"
        >
          {labels?.drawer?.new}
        </Text>
        <Box className={classes.form}>
          <ScoresPeriodForm
            labels={labels?.form}
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
              if (isFunction(onPeriodChange)) {
                onPeriodChange(v);
              }
              if (v.center !== center && allowCenterChange) {
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
            onSubmit={(v) => {
              const period = getMostSpecificPeriod(v, periods);

              if (isFunction(onPeriodSubmit)) {
                onPeriodSubmit({ ...v, period });
              }
            }}
            locale={locale}
          />
        </Box>
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
  onPeriodSubmit: PropTypes.func,
  onPeriodChange: PropTypes.func,
  locale: PropTypes.string,
  fields: PropTypes.object,
  requiredFields: PropTypes.array,
};

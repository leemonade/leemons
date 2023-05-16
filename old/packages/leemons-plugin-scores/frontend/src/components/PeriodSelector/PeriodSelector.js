import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  createStyles,
  DrawerPush,
  ImageLoader,
  Loader,
  Paragraph,
  Text,
} from '@bubbles-ui/components';

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
import { getClassIcon } from '@academic-portfolio/helpers/getClassIcon';

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
    marginBottom: theme.spacing[10],
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

function ClassItem({ class: klass, ...props }) {
  return (
    <Box {...props}>
      <Box
        sx={(theme) => ({
          display: 'flex',
          flexDirection: 'row',
          gap: theme.spacing[2],
          alignItems: 'center',
        })}
      >
        <Box
          sx={() => ({
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: 26,
            minHeight: 26,
            maxWidth: 26,
            maxHeight: 26,
            borderRadius: '50%',
            backgroundColor: klass?.color,
          })}
        >
          <ImageLoader
            sx={() => ({
              borderRadius: 0,
              filter: 'brightness(0) invert(1)',
            })}
            forceImage
            width={16}
            height={16}
            src={getClassIcon(klass)}
          />
        </Box>
        <Text>{`${klass.subject.name}${klass?.groups?.name ? ` - ${klass.groups.name}` : ''
          }`}</Text>
      </Box>
    </Box>
  );
}

ClassItem.propTypes = {
  class: PropTypes.object.isRequired,
};

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
  const [group, setGroup] = React.useState(null);
  const [periodSelected, setPeriodSelected] = React.useState(null);

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

  const { data: allTeacherClasses, isLoading: isLoadingTeacherClasses } = useSessionClasses(
    {},
    { enabled: !!fields?.class }
  );

  const fieldsToUse = useMemo(() => {
    const fieldsToReturn = [];

    if (fields.class) {
      // The class field excludes the other fields
      return [
        {
          name: 'class',
          label: labels?.form?.class?.label,
          placeholder: labels?.form?.class?.placeholder,
          itemComponent: (item) => (
            <ClassItem class={allTeacherClasses.find((c) => c.id === item.value)} {...item} />
          ),
          valueComponent: (item) => (
            <ClassItem class={allTeacherClasses.find((c) => c.id === item.value)} {...item} />
          ),
          data:
            allTeacherClasses?.map((klass) => ({
              value: klass.id,
            })) || [],
          required: labels?.form?.class?.error,
        },
      ];
    }

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
    } else if (fields.center) {
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

    // EN: MoreThanOneAcademicYear is when a subject can be teached on more than one academic year.
    // ES: MoreThanOneAcademicYear es cuando una asignatura puede estudiarse en varios cursos.
    const courseIsRequired =
      programData?.maxNumberOfCourses > 1 &&
      requiredFields.includes('course') &&
      !programData?.moreThanOneAcademicYear;

    if (programData?.maxNumberOfCourses > 1 && (fields.course || courseIsRequired)) {
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
  }, [
    fields,
    centers,
    programs,
    programData,
    center,
    course,
    subject,
    teacherClasses,
    allTeacherClasses,
  ]);

  if ((fields?.class && isLoadingTeacherClasses) || (fields?.center && isLoadingCenters)) {
    return <Loader />;
  }

  return (
    <DrawerPush opened={opened} size={size} fixed={fixed}>
      <Box className={classes.drawer}>
        <Box className={classes.drawerTitle}>
          <Box className={classes.titleTop}>
            <PluginScoresBasicIcon width={18} height={18} />
            <Text size="lg">{labels?.drawer?.title}</Text>
          </Box>
        </Box>
        <Paragraph className={classes.drawerText}>{labels?.drawer?.description}</Paragraph>

        {allowCreate && (
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
        )}
        <Box className={classes.form}>
          <ScoresPeriodForm
            labels={labels?.form}
            errorMessages={errorMessages}
            fields={fieldsToUse}
            allowCreate={allowCreate}
            periods={periods?.filter((period) => {
              if ((fields.center && period.center !== center) || period.program !== program) {
                return false;
              }

              if (period.course && period.course !== course) {
                return false;
              }

              return true;
            })}
            onPeriodSelect={(period) => {
              setPeriodSelected(period);

              if (period && isFunction(onPeriodSubmit)) {
                onPeriodSubmit({
                  program,
                  center,
                  course,
                  subject,
                  group,
                  startDate: period.startDate,
                  endDate: period.endDate,
                  period,
                });
              }
            }}
            onSave={(name, share, data) => {
              onPeriodSave(name, !!share, {
                ...data,
                center,
                program,
                course,
                subject,
                group,
              });
            }}
            onChange={(v) => {
              if (fields.class) {
                if (!v.class) {
                  if (!v.program) {
                    setProgram(null);
                  }

                  if (!v.course) {
                    setCourse(null);
                  }
                } else {
                  const vClassId = _.isArray(v.class) ? v.class[0] : v.class;
                  const c = allTeacherClasses.find((klass) => klass.id === vClassId);

                  onPeriodChange({
                    ...v,
                    program: c.program,
                    course: c.course,
                    subject: c.subject?.id,
                    group: c.groups?.id,
                  });

                  if (periodSelected && isFunction(onPeriodSubmit)) {
                    onPeriodSubmit({
                      program: c.program,
                      center: c.center,
                      course: c.course,
                      subject: c.subject?.id,
                      group: c.groups?.id,
                      period: periodSelected,
                    });
                  }

                  setProgram(c?.program);
                  setCourse(c?.subject?.course);
                  setSubject(c?.subject?.id);
                  setGroup(c?.groups?.id);
                }
                return;
              }

              if (isFunction(onPeriodChange)) {
                onPeriodChange(v);
              }

              if (periodSelected && isFunction(onPeriodSubmit)) {
                onPeriodSubmit({
                  ...v,
                  period: periodSelected,
                });
              }

              if (v.center !== center && allowCenterChange) {
                setCenter(v.center);
                setProgram(null);
                setCourse(null);
                setSubject(null);
                setGroup(null);
              }
              if (v.program !== program) {
                setProgram(v.program);
                setCourse(null);
                setSubject(null);
                setGroup(null);
              }

              if (v.course !== course) {
                setCourse(v.course);
                setSubject(null);
                setGroup(null);
              }

              if (v.subject !== subject) {
                setSubject(v.subject);
                setGroup(null);
              }

              if (v.group !== group) {
                setGroup(v.group);
              }
            }}
            onSubmit={(v) => {
              let period;
              if (v.class) {
                const vClassId = _.isArray(v.class) ? v.class[0] : v.class;
                const c = allTeacherClasses.find((klass) => klass.id === vClassId);

                const classValues = {
                  ...v,
                  program: c.program,
                  course: c.course,
                  subject: c.subject?.id,
                  group: c.groups?.id,
                };
                period = getMostSpecificPeriod(classValues, periods);

                if (isFunction(onPeriodSubmit)) {
                  onPeriodSubmit({ ...classValues, period });
                }
              } else {
                period = getMostSpecificPeriod(v, periods);
                if (isFunction(onPeriodSubmit)) {
                  onPeriodSubmit({ ...v, period });
                }
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

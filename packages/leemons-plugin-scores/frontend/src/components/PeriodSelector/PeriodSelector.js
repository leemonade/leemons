import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Box, createStyles, DrawerPush, Loader, Text } from '@bubbles-ui/components';

import { PluginScoresBasicIcon } from '@bubbles-ui/icons/outline';
import { ScoresPeriodForm } from '@bubbles-ui/leemons';
import { useUserCenters } from '@users/hooks';
import { useCenterPrograms, useProgramDetail } from '@academic-portfolio/hooks';
import useSubjectClasses from '@academic-portfolio/hooks/useSubjectClasses';
import { getCentersWithToken } from '@users/session';

import _ from 'lodash';
import { unflatten } from '@common';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { prefixPN } from '@scores/helpers';

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

  // const labels = {
  //   form: {
  //     startDate: 'Fecha inicio',
  //     endDate: 'Fecha fin',
  //     submit: 'Buscar',
  //     newPeriod: 'Nuevo periodo',
  //     addPeriod: 'Añadir periodo',
  //     shareWithTeachers: 'Compartir con profesores',
  //     saveButton: 'Guardar periodo',
  //     periodName: 'Nombre del periodo',
  //     center: {
  //       label: 'Centro',
  //       placeholder: 'Selecciona un centro',
  //       error: 'El centro es requerido',
  //     },
  //     program: {
  //       label: 'Programa',
  //       placeholder: 'Selecciona un programa',
  //       error: 'El programa es requerido',
  //     },
  //     course: {
  //       label: 'Curso',
  //       placeholder: 'Selecciona un curso',
  //       error: 'El curso es requerido',
  //     },
  //     subject: {
  //       label: 'Asignatura',
  //       placeholder: 'Selecciona una asignatura',
  //       error: 'La asignatura es requerida',
  //     },
  //     group: {
  //       label: 'Grupo',
  //       placeholder: 'Selecciona un grupo',
  //       error: 'El grupo es requerido',
  //     },
  //   },
  //   drawer: {
  //     title: 'Scores/Puntuaciones',
  //     description:
  //       'Como administrador, puedes crear periódos de tiempo personalizados para facilitar la labor de evaluación de los profesores, por ejemplo, pre-definiendo los periódos de evaluación por programa y curso.',
  //     new: 'Nuevo periodo',
  //   },
  // };

  // const errorMessages = {
  //   startDate: 'La fecha de inicio es requerida',
  //   endDate: 'La fecha de fin es requerida',
  //   validateStartDate: 'La fecha de inicio debe ser anterior a la fecha de fin',
  //   validateEndDate: 'La fecha de fin debe ser posterior a la fecha de inicio',
  //   periodName: 'El nombre del periodo es requerido',
  // };

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

    const couseIsRequired =
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
        required: couseIsRequired && labels?.form?.course?.error,
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
        label: labels?.form?.subject?.label,
        placeholder: labels?.form?.subject?.placeholder,
        disabled: (couseIsRequired && !course) || !subjects?.length,
        data: subjects,
        required: requiredFields.includes('subject') && labels?.form?.subject?.error,
      });
    }

    if (fields.group) {
      fieldsToReturn.push({
        name: 'group',
        label: labels?.form?.group?.label,
        placeholder: labels?.form?.group?.placeholder,
        disabled: !subject || !apClasses?.length || !course || !subjects?.length,
        data: (apClasses || []).map(({ groups, id }) => ({
          label: groups.name,
          value: id,
        })),
        required: requiredFields.includes('group') && labels?.form?.group?.error,
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

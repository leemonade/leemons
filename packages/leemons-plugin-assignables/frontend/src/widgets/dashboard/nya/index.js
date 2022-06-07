import React, { useMemo } from 'react';
import dayjs from 'dayjs';
import { Swiper, Box, Text, Loader } from '@bubbles-ui/components';
import { LibraryCard } from '@bubbles-ui/leemons';
import prepareAsset from '@leebrary/helpers/prepareAsset';
import useAssignablesContext from '@assignables/hooks/useAssignablesContext';
import { useApi, unflatten, useLocale, LocaleDate, LocaleRelativeTime } from '@common';
import _ from 'lodash';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import useSearchAssignableInstances from '../../../hooks/assignableInstance/useSearchAssignableInstances';
import useAssignationsByProfile from '../../../components/Ongoing/AssignmentList/hooks/useAssignationsByProfile';
import getClassData from '../../../helpers/getClassData';
import prefixPN from '../../../helpers/prefixPN';
import getStatus from '../../../components/Details/components/UsersList/helpers/getStatus';

function parseAssignation({ isTeacher, instance, subject, labels }) {
  if (isTeacher) {
    const { students } = instance;

    // EN: If the activity is not started yer, the assignation is not available
    // ES: Si la actividad no ha sido iniciada, la asignación no está disponible
    if (!students?.[0]?.started) {
      return null;
    }
    const submission = students.filter((student) => student.timestamps.end).length;

    // EN: Avg time only including the students who have finished the assignation
    // ES: Tiempo promedio solo incluyendo a los estudiantes que han finalizado la asignación
    const avgTime = (
      students
        .map((student) => {
          const { timestamps } = student;
          const { start, end } = timestamps;

          if (!start || !end) {
            return 0;
          }

          const startTime = new Date(start);
          const endTime = new Date(end);

          return (endTime - startTime) / 1000;
        })
        .reduce((acc, time) => acc + time, 0) / submission || 0
    ).toFixed(2);

    const total = students.length;
    return {
      // Only if finished
      completed: submission / total,
      submission,
      total,
      subject: {
        name: subject.name,
      },
      labels: labels?.assigment,
      avgTime,
    };
  }
}

function parseDeadline(isTeacher, obj) {
  let instance = obj;

  if (!isTeacher) {
    instance = obj.instance;
  }

  const labels = {
    evaluated: 'Ver evaluación',
    submission: 'Entrega',
    evaluate: 'Para evaluar',
    evaluation: 'Evaluación',
    opened: 'Actividad abierta',
    start: 'Fecha inicio',
    assigned: 'Programada',
    late: 'Tarde',
    submitted: 'Entregada',
    startActivity: 'Empezar actividad',
  };

  let main = null;
  let severity = 'low';
  let backgroundColor = 'default';
  let secondary = null;
  let dateToShow = null;

  const today = dayjs();
  const deadline = dayjs(instance?.dates?.deadline || null);
  const startDate = dayjs(instance?.dates?.start || null);
  const isDeadline = deadline.isValid() && !deadline.isAfter(today);

  if (!isTeacher) {
    const submission = dayjs(obj?.timestamps?.end || null);
    const status = getStatus(obj, instance);
    if (status === 'evaluated') {
      main = labels.evaluated;
      if (deadline.isValid()) {
        secondary = labels?.submission;
        dateToShow = deadline.toDate();
      }
    } else if (status === 'late') {
      main = labels.late;
      if (deadline.isValid()) {
        secondary = labels?.submission;
        dateToShow = deadline.toDate();
      }
    } else if (status === 'submitted') {
      main = labels.submitted;
      if (submission.isValid()) {
        secondary = labels?.submitted;
        dateToShow = submission.toDate();
      }
    } else if (status === 'started' || status === 'opened') {
      const daysUntilDeadline = deadline.diff(today, 'days');
      const durationInSeconds = deadline.diff(today, 'seconds');

      if (deadline.isValid()) {
        secondary = labels?.submission;
        dateToShow = deadline.toDate();
      }

      if (isDeadline) {
        main = 'late';
      } else if (daysUntilDeadline <= 5) {
        severity = 'medium';
        if (daysUntilDeadline <= 2) {
          severity = 'high';
        }
        main = <LocaleRelativeTime seconds={durationInSeconds} />;
      } else {
        main = labels?.startActivity;
      }
    } else {
      main = labels?.assigned;
      if (startDate.isValid()) {
        secondary = labels?.start;
        dateToShow = startDate.toDate();
      }
    }
  } else {
    const closeDate = dayjs(instance?.dates?.close || null);
    const closedDate = dayjs(instance?.dates?.closed || null);

    const isClosed =
      (closeDate.isValid() && !closeDate.isAfter(today)) ||
      (closedDate.isValid() && !closedDate.isAfter(today));
    const isStarted =
      !isClosed &&
      !isDeadline &&
      ((startDate.isValid() && !startDate.isAfter(today)) || !startDate.isValid());

    if (isClosed) {
      // TODO: Check if it is already graded
      main = labels?.evaluated;
      if (deadline.isValid()) {
        secondary = labels?.submission;
        dateToShow = deadline.toDate();
      }
    } else if (isDeadline) {
      main = labels?.evaluate;
      if (closeDate.isValid()) {
        const daysUntilClose = closeDate.diff(today, 'day');
        const durationInSeconds = closeDate.diff(today, 'seconds');

        dateToShow = closeDate.isValid() && closeDate.toDate();
        if (daysUntilClose <= 5) {
          severity = 'medium';
          if (daysUntilClose <= 2) {
            severity = 'high';
          }
          if (daysUntilClose < 0) {
            backgroundColor = 'error';
          }
          secondary = <LocaleRelativeTime seconds={durationInSeconds} />;
        } else if (dateToShow) {
          secondary = labels?.evaluation;
        }
      } else {
        const daysSinceDeadline = today.diff(deadline, 'day');
        const durationInSeconds = today.diff(deadline, 'seconds');

        dateToShow = deadline.isValid() && deadline.toDate();

        if (daysSinceDeadline >= 2) {
          severity = 'medium';
          if (daysSinceDeadline >= 5) {
            severity = 'high';
          }
          if (daysSinceDeadline >= 7) {
            backgroundColor = 'error';
          }

          secondary = <LocaleRelativeTime seconds={durationInSeconds} />;
        } else if (dateToShow) {
          secondary = labels?.submission;
        }
      }
    } else if (isStarted) {
      main = labels?.opened;
      if (startDate.isValid()) {
        secondary = labels?.submission;
        dateToShow = startDate.toDate();
      }
    } else {
      main = labels?.assigned;
      if (startDate.isValid()) {
        secondary = labels?.start;
        dateToShow = startDate.toDate();
      }
    }
  }

  return {
    deadline: dateToShow,
    locale: 'es',
    severity,
    backgroundColor,
    labels: {
      title: main,
      deadline: secondary,
    },
    disableHover: true,
  };
}

function prepareInstances({ instances, isTeacher, query, labels }) {
  return Promise.all(
    instances.map(async (object) => {
      let instance = object;

      if (!isTeacher) {
        instance = object.instance;
      }

      const subjectData = await getClassData(instance.classes, {
        multiSubject: labels.multiSubject,
      });

      const assignment = parseAssignation({
        isTeacher,
        instance: object,
        subject: subjectData,
        labels,
      });
      const deadlineProps = parseDeadline(isTeacher, object);
      // const subject = {
      //   // Only if main dashboard or multi-language
      //   name: 'Bases para el análisis y el tratamiento de',
      //   color: '#FABADA',
      //   icon: 'https://upload.wikimedia.org/wikipedia/commons/8/87/Globe_icon_2.svg',
      // };

      const showSubject = query.classes === undefined || subjectData.name === labels.multiSubject;

      const subject = {
        name: subjectData.name,
        color: subjectData.color,
        icon: subjectData.icon,
      };

      let onClick = () => window.open(`/private/assignables/details/${instance.id}`, '_blank');

      const roleDetails = instance?.assignable?.roleDetails;

      if (!isTeacher) {
        if (!object.finished) {
          const activityUrl = roleDetails.studentDetailUrl
            .replace(':id', instance.id)
            .replace(':user', object.user);
          onClick = () => window.open(activityUrl, '_blank');
        } else {
          const revisionUrl = roleDetails.evaluationDetailUrl
            .replace(':id', instance.id)
            .replace(':user', object.user);
          onClick = () => window.open(revisionUrl, '_blank');
        }
      }

      return {
        ...instance,
        assignment,
        deadlineProps,
        subject: showSubject ? subject : null,
        isNew: object?.timestamps?.open === undefined && !isTeacher,
        asset: prepareAsset(instance.assignable.asset),
        onClick,
      };
    })
  );
}

function usePreparedInstances(instances, query, labels) {
  const { isTeacher } = useAssignablesContext();

  const options = React.useMemo(
    () => ({
      isTeacher,
      instances,
      query,
      labels,
    }),
    [isTeacher, instances, query, labels]
  );

  const [results, error] = useApi(prepareInstances, options);

  console.log('Use prepared instances error', error);
  if (!results) {
    return [];
  }

  return results;
}

export default function NYA({ classe, program }) {
  const [, translations] = useTranslateLoader([
    prefixPN('roles'),
    prefixPN('need_your_attention'),
    prefixPN('multiSubject'),
  ]);
  const locale = useLocale();

  const labels = useMemo(() => {
    if (translations && translations.items) {
      const res = unflatten(translations.items);
      return {
        ..._.get(res, prefixPN('need_your_attention')),
        roles: _.get(res, prefixPN('roles')),
        multiSubject: _.get(res, prefixPN('multiSubject')),
      };
    }

    return {};
  }, [translations]);

  // TODO: Only show program specific content
  const query = useMemo(() => {
    const q = {
      limit: 9,
      closed: false,
    };

    if (classe) {
      q.classes = JSON.stringify([classe?.id]);
    }

    return q;
  }, []);

  const [instances] = useSearchAssignableInstances(query);
  const [instancesData, instancesDataLoading] = useAssignationsByProfile(instances);

  const preparedAssets = usePreparedInstances(instancesData, query, labels);

  return (
    <Box
      sx={(theme) => ({
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing[6],
      })}
    >
      <Text size="lg" color="primary">
        {labels.title}
      </Text>
      {!preparedAssets?.length ? (
        <Loader />
      ) : (
        <Swiper
          // onSelectIndex={handleSelectIndex}
          selectable
          deselectable={false}
          disableSelectedStyles
          breakAt={{
            800: {
              slidesPerView: 2,
              spaceBetween: 16,
            },
            1200: {
              slidesPerView: 3,
              spaceBetween: 16,
            },
            1800: {
              slidesPerView: 4,
              spaceBetween: 16,
            },
            2000: {
              slidesPerView: 5,
              spaceBetween: 16,
            },
          }}
          slideStyles={{
            height: 'auto',
          }}
        >
          {preparedAssets.map((instance) => (
            <Box
              key={instance.id}
              style={{
                cursor: 'pointer',
                height: '100%',
              }}
              onClick={instance.onClick}
            >
              <LibraryCard
                fullHeight
                asset={instance.asset}
                variant="assigment"
                dashboard
                shadow
                locale={locale}
                assigment={instance.assignment}
                deadlineProps={instance.deadlineProps}
                subject={instance.subject}
                badge={instance.isNew && labels?.new?.toUpperCase()}
                variantTitle={labels?.roles?.[instance.assignable.role] || instance.assignable.role}
              />
            </Box>
          ))}
        </Swiper>
      )}
    </Box>
  );
}

import React, { useMemo } from 'react';
import dayjs from 'dayjs';
import { LibraryCard } from '@bubbles-ui/leemons';
import prepareAsset from '@leebrary/helpers/prepareAsset';
import useAssignablesContext from '@assignables/hooks/useAssignablesContext';
import { useApi, unflatten, useLocale, LocaleRelativeTime } from '@common';
import _ from 'lodash';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import getClassData from '../../helpers/getClassData';
import prefixPN from '../../helpers/prefixPN';
import getStatus from '../Details/components/UsersList/helpers/getStatus';

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

  return null;
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

async function prepareInstance({ instance: object, isTeacher, query, labels }) {
  // return Promise.all(
  //   instances.map(async (object) => {
  let instance = object;

  if (!isTeacher) {
    instance = object.instance;
  }
  let subjectData;

  if (query.classData && query.classData[instance.id]) {
    subjectData = query.classData[instance.id];
  } else {
    subjectData = await getClassData(instance.classes, {
      multiSubject: labels.multiSubject,
    });
  }

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

  const showSubject = query.showSubject || subjectData.name === labels.multiSubject;

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
  // }
  // );
}

function usePreparedInstance(instance, query, labels) {
  const { isTeacher } = useAssignablesContext();

  const options = React.useMemo(
    () => ({
      isTeacher,
      instance,
      query,
      labels,
    }),
    [isTeacher, instance, query, labels]
  );

  const [results, error] = useApi(prepareInstance, options);

  if (!results) {
    return null;
  }

  return results;
}

export default function NYACard({
  instance,
  showSubject,
  labels: _labels,
  classData,
  //  asset,
  // assignment,
  // deadlineProps,
  // subject,
  // badge,
  // variantTitle,
  // role,
  // isNew,
  // labels
}) {
  const locale = useLocale();
  const useOwnLabels = useMemo(() => _labels === undefined, []);

  let labels = _labels;
  if (useOwnLabels) {
    const [, translations] = useTranslateLoader([
      prefixPN('roles'),
      prefixPN('need_your_attention'),
      prefixPN('multiSubject'),
    ]);

    labels = useMemo(() => {
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
  }

  const query = useMemo(
    () => ({
      classData,
      showSubject,
    }),
    [showSubject]
  );

  const preparedInstance = usePreparedInstance(instance, query, labels);

  if (!preparedInstance) {
    return null;
  }

  return (
    <LibraryCard
      fullHeight
      asset={preparedInstance?.asset}
      variant="assigment"
      dashboard
      shadow
      locale={locale}
      assigment={preparedInstance?.assignment}
      deadlineProps={preparedInstance?.deadlineProps}
      subject={preparedInstance?.subject}
      badge={preparedInstance?.isNew && labels?.new?.toUpperCase()}
      variantTitle={labels?.roles?.[instance.assignable.role] || instance.assignable.role}
    />
  );
}

import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import { LocaleDate, LocaleRelativeTime, unflatten } from '@common';
import {
  Badge,
  Box,
  ContextContainer,
  ImageLoader,
  Text,
  TextClamp,
  createStyles,
  Tooltip,
} from '@bubbles-ui/components';
import { EditIcon, ViewOnIcon } from '@bubbles-ui/icons/outline';
import dayjs from 'dayjs';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prepareAsset from '@leebrary/helpers/prepareAsset';
import { useQuery } from '@tanstack/react-query';
import UnreadMessages from '@comunica/UnreadMessages';
import useProgramEvaluationSystem from '@assignables/hooks/useProgramEvaluationSystem';
import { useIsTeacher } from '@academic-portfolio/hooks';
import getClassData from '../../../../helpers/getClassData';
import getStatus from '../../../Details/components/UsersList/helpers/getStatus';
import prefixPN from '../../../../helpers/prefixPN';

function parseDates(dates, keysToParse) {
  let datesToParse = dates;

  if (keysToParse?.length) {
    datesToParse = _.pick(dates, keysToParse);
  }

  return _.mapValues(datesToParse, (date) => (
    <LocaleDate date={date} options={{ dateStyle: 'short', timeStyle: 'short' }} />
  ));
}

function getStudentsStatusForTeacher(assignation) {
  const { students } = assignation;
  const getPercentage = (studentsCompleted) =>
    Math.floor((studentsCompleted / students.length) * 100);

  const status = {
    open: 0,
    ongoing: 0,
    completed: 0,
  };

  students.forEach((student) => {
    const {
      timestamps: { open, start, end },
    } = student;

    const isEnded = !!end;
    const isStarted = start || isEnded;
    const isOpened = open || isStarted;

    if (isEnded) {
      status.completed += 1;
    }
    if (isStarted) {
      status.ongoing += 1;
    }
    if (isOpened) {
      status.open += 1;
    }
  });

  const statusWithPercentage = _.mapValues(status, (value) => {
    const percentage = getPercentage(value);
    let severity = 'success';

    if (percentage < 33) {
      severity = 'error';
    } else if (percentage < 66) {
      severity = 'warning';
    }

    return (
      <ContextContainer direction="row">
        <Badge severity={severity} label={`${percentage}%`} closable={false} radius="default " />
      </ContextContainer>
    );
  });

  return statusWithPercentage;
}

function getTimeReferenceColor(date) {
  const timeReference = dayjs(date).diff(dayjs(), 'days');
  if (timeReference < 2) {
    return 'error';
  }
  if (timeReference < 5) {
    return 'warning';
  }
  return 'primary';
}

const useActionIconStyles = createStyles((theme) => ({
  enabled: {
    color: theme.colors.interactive01,
  },
  disabled: {
    // There is no disabled token
    color: '#C3C8CE',
    cursor: 'not-allowed',
  },
}));

function ActionIcon({ icon, disabled }) {
  const { classes } = useActionIconStyles();

  return <Box className={disabled ? classes.disabled : classes.enabled}>{icon}</Box>;
}

function TeacherActions({ instance }) {
  const { id } = instance;
  const role = instance?.assignable?.roleDetails;

  const dashboardUrl = React.useMemo(
    () => () => (role.dashboardUrl || '/private/assignables/details/:id').replace(':id', id),
    [id, role?.dashboardUrl]
  );

  return (
    <Link to={dashboardUrl}>
      <ActionIcon icon={<ViewOnIcon />} />
    </Link>
  );
}

function StudentActions({ assignation, labels }) {
  const id = assignation?.instance?.id;
  const role = assignation?.instance?.assignable?.roleDetails;
  const user = assignation?.user;
  const showRevisionPage =
    assignation?.instance?.showResults || assignation?.instance?.showCorrectAnswers;

  const hasPreviousActivitiesCompleted = React.useMemo(() => {
    if (!assignation?.relatedAssignableInstances?.before?.length) {
      return true;
    }

    return assignation.relatedAssignableInstances.before.every(
      (instance) => !instance.required || instance.timestamps?.end
    );
  }, [assignation?.relatedAssignableInstances]);

  const activityUrl = useMemo(
    () => role.studentDetailUrl.replace(':id', id).replace(':user', user),
    [id, role?.studentDetailUrl]
  );
  const revisionUrl = useMemo(() =>
    role.evaluationDetailUrl.replace(':id', id).replace(':user', user)
  );

  const finished = assignation?.finished;
  const started = assignation?.started;

  if (finished) {
    if (showRevisionPage) {
      return (
        <Link to={revisionUrl}>
          <ActionIcon icon={<ViewOnIcon />} />
        </Link>
      );
    }
    return (
      <Tooltip label={labels?.student_actions?.disabled?.results} position="left">
        <ActionIcon icon={<ViewOnIcon />} disabled />
      </Tooltip>
    );
  }

  if (!started) {
    if (!hasPreviousActivitiesCompleted) {
      return (
        <Tooltip label={labels?.student_actions?.disabled?.previous} position="left">
          <ActionIcon icon={<ViewOnIcon />} disabled />
        </Tooltip>
      );
    }

    return (
      <Link to={activityUrl}>
        <ActionIcon icon={<ViewOnIcon />} />
      </Link>
    );
  }

  if (!hasPreviousActivitiesCompleted) {
    return (
      <Tooltip label={labels?.student_actions?.disabled?.previous} position="left">
        <ActionIcon icon={<EditIcon />} disabled />
      </Tooltip>
    );
  }
  return (
    <Link to={activityUrl}>
      <ActionIcon icon={<EditIcon />} />
    </Link>
  );
}

function ActivityItem({ instance }) {
  const assignable = instance?.assignable;
  const preparedAsset = prepareAsset(assignable?.asset);
  return (
    <Box
      sx={(theme) => ({
        display: 'flex',
        flexDirection: 'row',
        gap: theme.spacing[2],
        alignItems: 'center',
      })}
    >
      <ImageLoader src={preparedAsset?.cover} width={36} height={36} />
      <TextClamp lines={1}>
        <Text>{assignable?.asset?.name}</Text>
      </TextClamp>
    </Box>
  );
}

function SubjectItem({ classData, fullLength }) {
  return (
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
          backgroundColor: classData?.color,
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
          src={classData?.icon}
        />
      </Box>
      <TextClamp lines={1}>
        <Text>{fullLength ? classData?.name : classData?.groupName || classData?.name}</Text>
      </TextClamp>
    </Box>
  );
}

function TimeReference({ assignation, status, labels }) {
  if (status === 'closed') {
    return (
      <Text strong color="error">
        {labels.notSubmitted}
      </Text>
    );
  }
  if (status === 'opened' || status === 'assigned' || status === 'started') {
    const deadline = dayjs(assignation?.instance?.dates?.deadline || null);
    const today = dayjs();
    const color = getTimeReferenceColor(deadline);
    if (deadline.isValid()) {
      return (
        <Text strong color={color}>
          <LocaleRelativeTime
            firstLetterUppercase
            seconds={dayjs(assignation?.instance.dates.deadline).diff(today, 'seconds')}
          />
        </Text>
      );
    }

    return (
      <Text strong color="primary">
        {labels.noLimit}
      </Text>
    );
  }

  if (status === 'submitted') {
    return (
      <Text strong color="success">
        {labels.submitted}
      </Text>
    );
  }

  if (status === 'late') {
    return (
      <Text strong color="error">
        {labels.late}
      </Text>
    );
  }

  if (status === 'evaluated') {
    return (
      <Text strong color="success">
        {labels.evaluated}
      </Text>
    );
  }

  return (
    <Text strong color="primary">
      {labels[status] || status}
    </Text>
  );
}

function Grade({ grade, instance, show }) {
  const evaluationSystem = useProgramEvaluationSystem(instance);

  const gradeToPrint = React.useMemo(() => {
    if (evaluationSystem?.type === 'letter') {
      let letterGrade = null;
      for (let i = 0, scalesLength = evaluationSystem?.scales?.length; i < scalesLength; i++) {
        const scale = evaluationSystem.scales[i];
        if (grade >= scale?.number) {
          letterGrade = scale?.letter;
        } else {
          break;
        }
      }

      return letterGrade;
    }

    const maxGrade = evaluationSystem?.maxScale?.number;
    const minGrade = evaluationSystem?.minScale?.number;

    if (grade >= maxGrade) {
      return maxGrade;
    }
    if (grade <= minGrade) {
      return minGrade;
    }

    return grade.toFixed(2);
  }, [grade, evaluationSystem]);

  const gradeColor = React.useMemo(() => {
    const minGradeToPromote = evaluationSystem?.minScaleToPromote?.number;

    if (grade >= minGradeToPromote) {
      return 'success';
    }
    return 'error';
  }, [grade, evaluationSystem]);

  if (!show || !evaluationSystem) {
    return '-';
  }

  return <Text color={gradeColor}>{gradeToPrint}</Text>;
}

async function parseAssignationForCommonView(instance, labels, { subjectFullLength }) {
  const parsedDates = parseDates(instance.dates, ['start', 'deadline']);
  const classData = await getClassData(instance.classes, {
    multiSubject: labels.multiSubject,
    groupName: instance?.metadata?.groupName,
  });

  return {
    id: instance.id,
    activity: <ActivityItem instance={instance} />,
    parsedDates: {
      deadline: '-',
      start: '-',
      ...parsedDates,
    },
    subject: <SubjectItem classData={classData} fullLength={subjectFullLength} />,
  };
}

async function parseAssignationForTeacherView(instance, labels, options) {
  const studentsStatus = getStudentsStatusForTeacher(instance);

  const commonData = await parseAssignationForCommonView(instance, labels, options);

  let rooms = [];
  _.forEach(instance.students, ({ chatKeys }) => {
    rooms = rooms.concat(chatKeys);
  });
  rooms = _.uniq(rooms);

  return {
    ...commonData,
    ...studentsStatus,
    students: instance?.students?.length,
    actions: <TeacherActions instance={instance} />,
    unreadMessages: <UnreadMessages rooms={rooms} />,
  };
}

async function parseAssignationForStudentView(assignation, labels, options) {
  const { instance } = assignation;
  const _status = getStatus(assignation, instance);
  const status = labels?.activity_status?.[_status];

  const calculatedGrade = assignation?.grades
    ?.filter(({ type }) => type === 'main')
    .reduce(
      ({ total, count }, { grade }) => ({
        count: count + 1,
        total: total + grade,
      }),
      { total: 0, count: 0 }
    );

  const avgGrade = calculatedGrade.total / calculatedGrade.count;

  const commonData = await parseAssignationForCommonView(instance, labels, options);
  return {
    ...commonData,
    status,
    actions: <StudentActions assignation={assignation} labels={labels} />,
    submission: (
      <TimeReference assignation={assignation} status={_status} labels={labels.activity_status} />
    ),
    unreadMessages: <UnreadMessages rooms={assignation.chatKeys} />,
    grade: instance?.requiresScoring ? (
      <Grade grade={avgGrade} instance={instance} show={calculatedGrade?.count > 0} />
    ) : (
      <Text color="success">{labels?.activity_status?.evaluated}</Text>
    ),
  };
}

function parseAssignations({ assignations, parserToUse, labels, options }) {
  if (!assignations.length) {
    return [];
  }

  return Promise.all(assignations?.map((assignation) => parserToUse(assignation, labels, options)));
}

export default function useParseAssignations(assignations, options) {
  const [, translations] = useTranslateLoader([
    prefixPN('student_actions'),
    prefixPN('activity_status'),
    prefixPN('multiSubject'),
  ]);

  const labels = useMemo(() => {
    if (translations && translations.items) {
      const res = unflatten(translations.items);
      const data = {
        student_actions: _.get(res, prefixPN('student_actions')),
        activity_status: _.get(res, prefixPN('activity_status')),
        multiSubject: _.get(res, prefixPN('multiSubject')),
      };

      // EN: Modify the data object here
      // ES: Modifica el objeto data aquí
      return data;
    }

    return {};
  }, [translations]);

  const isTeacher = useIsTeacher();

  const parserToUse = useMemo(
    () => (isTeacher ? parseAssignationForTeacherView : parseAssignationForStudentView),
    [isTeacher]
  );

  const result = useQuery(
    [
      'parseAssignations',
      {
        parserToUse: parserToUse.toString(),
        assignations,
        labels,
        options,
      },
    ],
    () =>
      parseAssignations({
        assignations,
        labels,
        options,
        parserToUse,
      })
  );

  return result;
}

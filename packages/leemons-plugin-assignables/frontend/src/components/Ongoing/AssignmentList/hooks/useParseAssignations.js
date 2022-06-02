import React, { useMemo, useContext, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import _ from 'lodash';
import { LocaleDate, LocaleRelativeTime, useApi, unflatten } from '@common';
import {
  Badge,
  Text,
  ContextContainer,
  ActionButton,
  Button,
  ImageLoader,
  Box,
  TextClamp,
} from '@bubbles-ui/components';
import { ViewOnIcon, ViewOffIcon } from '@bubbles-ui/icons/outline';
import dayjs from 'dayjs';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prepareAsset from '@leebrary/helpers/prepareAsset';
import globalContext from '../../../../contexts/globalContext';
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

  students.map((student) => {
    const {
      timestamps: { open, start, end },
    } = student;

    if (end) {
      status.completed += 1;
    }
    if (start) {
      status.ongoing += 1;
    }
    if (open) {
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
        {value}
        <Badge severity={severity} label={`${percentage}%`} closable={false} radius="default " />
      </ContextContainer>
    );
  });

  return statusWithPercentage;
}

function getTeacherStatus(assignation) {
  const { dates } = assignation;

  const start = dayjs(dates.start || null);
  const deadline = dayjs(dates.deadline || null);
  const close = dayjs(dates.close || null);
  const closed = dayjs(dates.closed || null);
  const today = dayjs();

  if (
    close.isSame(today) ||
    close.isBefore(today) ||
    closed.isSame(today) ||
    closed.isBefore(today)
  ) {
    return 'closed';
  }
  if (deadline.isSame(today) || deadline.isBefore(today)) {
    return 'closed';
  }
  if (start.isSame(today) || start.isBefore(today)) {
    return 'opened';
  }
  return 'assigned';
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

function TeacherActions({ id }) {
  const history = useHistory();

  const redirectToInstance = useCallback(
    () => history.push(`/private/assignables/details/${id}`),
    [history]
  );

  return <ActionButton icon={<ViewOnIcon />} onClick={redirectToInstance} />;
}

function StudentActions({ assignation, labels }) {
  const id = assignation?.instance?.id;
  const role = assignation?.instance?.assignable?.roleDetails;
  const user = assignation?.user;

  const history = useHistory();
  const activityUrl = useMemo(
    () => role.studentDetailUrl.replace(':id', id).replace(':user', user),
    [id, role?.studentDetailUrl]
  );
  const revisionUrl = useMemo(() =>
    role.evaluationDetailUrl.replace(':id', id).replace(':user', user)
  );

  const dates = assignation?.instance?.dates;
  const timestamps = assignation?.timestamps;
  const finished = assignation?.finished;
  const started = assignation?.started;

  const now = dayjs();
  const visualization = dayjs(dates?.visualization);
  const start = dayjs(dates?.start);
  const alwaysAvailable = !(dates?.start && dates?.deadline);

  const redirectToInstance = useCallback(() => history.push(activityUrl), [history, activityUrl]);
  const redirectToRevision = useCallback(() => history.push(revisionUrl), [history, revisionUrl]);

  if (finished) {
    const hasCorrections = assignation?.grades
      ?.filter((grade) => grade.type === 'main')
      .some((grade) => grade.visibleToStudent);
    if (hasCorrections) {
      return (
        <Button variant="outline" onClick={redirectToRevision}>
          {labels?.student_actions?.correction}
        </Button>
      );
    }
    return (
      <Button variant="outline" onClick={redirectToRevision}>
        {labels?.student_actions?.review}
      </Button>
    );
  }

  if (alwaysAvailable) {
    if (timestamps?.start) {
      return <Button onClick={redirectToInstance}>{labels?.student_actions?.continue}</Button>;
    }
    // Start <= x < Deadline
    return <Button onClick={redirectToInstance}>{labels?.student_actions?.start}</Button>;
  }

  if (started) {
    if (timestamps?.start) {
      return <Button onClick={redirectToInstance}>{labels?.student_actions?.continue}</Button>;
    }
    // Start <= x < Deadline
    return <Button onClick={redirectToInstance}>{labels?.student_actions?.start}</Button>;
  }
  // Visualization <= x < Start
  if (!now.isBefore(visualization) && visualization.isValid() && !started) {
    return (
      <Button variant="outline" onClick={redirectToInstance}>
        {labels?.student_actions?.view}
      </Button>
    );
  }
  if (!now.isBefore(start) && start.isValid()) {
  }
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

function SubjectItem({ classData }) {
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
          width: 26,
          height: 26,
          borderRadius: '50%',
          backgroundColor: classData?.color,
        })}
      >
        <ImageLoader
          sx={() => ({
            filter: 'brightness(0) invert(1)',
          })}
          src={classData?.icon}
          width={16}
          height={16}
        />
      </Box>
      <TextClamp lines={1}>
        <Text>{classData?.groupName || classData?.name}</Text>
      </TextClamp>
    </Box>
  );
}

async function parseAssignationForCommonView(instance, labels) {
  const parsedDates = parseDates(instance.dates, ['start', 'deadline']);
  const classData = await getClassData(instance.classes, { multiSubject: labels.multiSubject });

  console.log('classData', classData);
  return {
    // TODO: Create unique id
    id: instance.id,
    activity: <ActivityItem instance={instance} />,
    parsedDates: {
      deadline: '-',
      start: '-',
      ...parsedDates,
    },
    subject: <SubjectItem classData={classData} />,
  };
}

async function parseAssignationForTeacherView(instance, labels) {
  const studentsStatus = getStudentsStatusForTeacher(instance);
  const status = getTeacherStatus(instance);
  const localizedStatus = labels?.activity_status?.[status];

  const commonData = await parseAssignationForCommonView(instance, labels);
  return {
    ...commonData,
    status: localizedStatus,
    ...studentsStatus,
    actions: <TeacherActions id={instance.id} />,
  };
}

async function parseAssignationForStudentView(assignation, labels) {
  const { instance } = assignation;
  const status = labels?.activity_status?.[getStatus(assignation, instance)];
  const timeReference = dayjs(instance.dates.deadline).diff(dayjs(), 'seconds');
  const timeReferenceColor = getTimeReferenceColor(instance.dates.deadline);

  const commonData = await parseAssignationForCommonView(instance, labels);
  return {
    ...commonData,
    status,
    actions: <StudentActions assignation={assignation} labels={labels} />,
    timeReference:
      !instance.dates.deadline || instance.dates.end ? (
        '-'
      ) : (
        <Text color={timeReferenceColor}>
          {timeReference < 0 ? (
            labels?.student_actions?.notSubmitted
          ) : (
            <LocaleRelativeTime seconds={Math.abs(timeReference)} short />
          )}
        </Text>
      ),
  };
}

function parseAssignations({ assignations, parserToUse, labels }) {
  if (!assignations.length) {
    return [];
  }

  return Promise.all(assignations?.map((assignation) => parserToUse(assignation, labels)));
}

export default function useParseAssignations(assignations) {
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

  const { isTeacher } = useContext(globalContext);

  const parserToUse = useMemo(
    () => (isTeacher ? parseAssignationForTeacherView : parseAssignationForStudentView),
    [isTeacher]
  );

  const options = useMemo(
    () => ({
      parserToUse,
      assignations,
      labels,
    }),
    [parserToUse, assignations, labels]
  );

  const defaultValue = useMemo(() => [], []);

  const [parsedAssignations, , loading] = useApi(parseAssignations, options);

  return [parsedAssignations || defaultValue, loading];
}

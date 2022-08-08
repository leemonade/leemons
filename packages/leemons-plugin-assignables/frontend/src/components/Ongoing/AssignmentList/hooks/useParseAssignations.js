import React, { useCallback, useContext, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import _ from 'lodash';
import { LocaleDate, LocaleRelativeTime, unflatten } from '@common';
import {
  Badge,
  Box,
  Button,
  ContextContainer,
  ImageLoader,
  Text,
  TextClamp,
} from '@bubbles-ui/components';
import { EditIcon, ViewOnIcon } from '@bubbles-ui/icons/outline';
import dayjs from 'dayjs';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prepareAsset from '@leebrary/helpers/prepareAsset';
import { useQuery } from 'react-query';
import UnreadMessages from '@comunica/UnreadMessages';
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
        {/* {value} */}
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

function TeacherActions({ id }) {
  const history = useHistory();

  const redirectToInstance = useCallback(
    () => window.open(`/private/assignables/details/${id}`, '_blank'),
    [history, id]
  );
  // const redirectToInstance = useCallback(
  //   () => history.push(`/private/assignables/details/${id}`),
  //   [history, id]
  // );

  return (
    <Button
      iconOnly
      variant="link"
      color="primary"
      rightIcon={<ViewOnIcon />}
      onClick={redirectToInstance}
    />
  );
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

  // const dates = assignation?.instance?.dates;
  // const timestamps = assignation?.timestamps;
  const finished = assignation?.finished;
  const started = assignation?.started;

  // const now = dayjs();
  // const visualization = dayjs(dates?.visualization);
  // const start = dayjs(dates?.start);
  // const alwaysAvailable = !(dates?.start && dates?.deadline);

  // const redirectToInstance = useCallback(() => history.push(activityUrl), [history, activityUrl]);
  // const redirectToRevision = useCallback(() => history.push(revisionUrl), [history, revisionUrl]);
  const redirectToInstance = useCallback(
    () => window.open(activityUrl, '_blank'),
    [history, activityUrl]
  );
  const redirectToRevision = useCallback(
    () => window.open(revisionUrl, '_blank'),
    [history, revisionUrl]
  );

  if (finished) {
    return (
      <Button
        iconOnly
        variant="link"
        color="primary"
        rightIcon={<ViewOnIcon />}
        onClick={redirectToRevision}
      />
    );
    // const hasCorrections = assignation?.grades
    //   ?.filter((grade) => grade.type === 'main')
    //   .some((grade) => grade.visibleToStudent);
    // if (hasCorrections) {
    //   return (
    //     <Button variant="outline" onClick={redirectToRevision}>
    //       {labels?.student_actions?.correction}
    //     </Button>
    //   );
    // }
    // return (
    //   <Button variant="outline" onClick={redirectToRevision}>
    //     {labels?.student_actions?.review}
    //   </Button>
    // );
  }

  if (!started) {
    return (
      <Button
        iconOnly
        variant="link"
        color="primary"
        rightIcon={<ViewOnIcon />}
        onClick={redirectToInstance}
      />
    );
  }

  return (
    <Button
      iconOnly
      variant="link"
      color="primary"
      rightIcon={<EditIcon />}
      onClick={redirectToInstance}
    />
  );
  // if (alwaysAvailable) {
  //   if (timestamps?.start) {
  //     return <Button onClick={redirectToInstance}>{labels?.student_actions?.continue}</Button>;
  //   }
  //   // Start <= x < Deadline
  //   return <Button onClick={redirectToInstance}>{labels?.student_actions?.start}</Button>;
  // }

  // if (started) {
  //   if (timestamps?.start) {
  //     return <Button onClick={redirectToInstance}>{labels?.student_actions?.continue}</Button>;
  //   }
  //   // Start <= x < Deadline
  //   return <Button onClick={redirectToInstance}>{labels?.student_actions?.start}</Button>;
  // }
  // // Visualization <= x < Start
  // if (!now.isBefore(visualization) && visualization.isValid() && !started) {
  //   return (
  //     <Button variant="outline" onClick={redirectToInstance}>
  //       {labels?.student_actions?.view}
  //     </Button>
  //   );
  // }
  // if (!now.isBefore(start) && start.isValid()) {
  // }
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
          width: 26,
          height: 26,
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

async function parseAssignationForCommonView(instance, labels, { subjectFullLength }) {
  const parsedDates = parseDates(instance.dates, ['start', 'deadline']);
  const classData = await getClassData(instance.classes, {
    multiSubject: labels.multiSubject,
    groupName: instance?.metadata?.groupName,
  });

  return {
    // TODO: Create unique id
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
    actions: <TeacherActions id={instance.id} />,
    unreadMessages: <UnreadMessages rooms={rooms} />,
  };
}

async function parseAssignationForStudentView(assignation, labels, options) {
  const { instance } = assignation;
  const _status = getStatus(assignation, instance);
  const status = labels?.activity_status?.[_status];

  const commonData = await parseAssignationForCommonView(instance, labels, options);
  return {
    ...commonData,
    status,
    actions: <StudentActions assignation={assignation} labels={labels} />,
    submission: (
      <TimeReference assignation={assignation} status={_status} labels={labels.activity_status} />
    ),
    unreadMessages: <UnreadMessages rooms={assignation.chatKeys} />,
    // !instance.dates.deadline || instance.dates.end ? (
    //   '-'
    // ) : (
    //   <Text color={timeReferenceColor}>
    //     {timeReference < 0 ? (
    //       labels?.student_actions?.notSubmitted
    //     ) : (
    //       <LocaleRelativeTime seconds={Math.abs(timeReference)} short />
    //     )}
    //   </Text>
    // ),
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

  const { isTeacher } = useContext(globalContext);

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
  // const [parsedAssignations, , loading] = useApi(parseAssignations, parseAssignationsOptions);

  return result;
}

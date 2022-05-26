import React, { useMemo, useContext, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import _ from 'lodash';
import { LocaleDate, LocaleRelativeTime, useApi } from '@common';
import { Badge, Text, ContextContainer, ActionButton } from '@bubbles-ui/components';
import { ViewOnIcon, ViewOffIcon } from '@bubbles-ui/icons/outline';
import dayjs from 'dayjs';
import globalContext from '../../../../contexts/globalContext';
import getClassData from '../../../../helpers/getClassData';
import getStatus from '../../../Details/components/UsersList/helpers/getStatus';

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
    return 'Finished';
  }
  if (deadline.isSame(today) || deadline.isBefore(today)) {
    return 'Completed';
  }
  if (start.isSame(today) || start.isBefore(today)) {
    return 'Started';
  }
  return 'Assigned';
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

function StudentActions({ id, user, role, late, submitted }) {
  const history = useHistory();
  const url = useMemo(
    () => role.studentDetailUrl.replace(':id', id).replace(':user', user),
    [id, role?.studentDetailUrl]
  );

  const redirectToInstance = useCallback(() => history.push(url), [history, url]);

  if (late && !submitted) {
    return <ActionButton icon={<ViewOffIcon />} disabled />;
  }
  if (!submitted) {
    return <ActionButton icon={<ViewOnIcon />} onClick={redirectToInstance} />;
  }
  return <p>See correction</p>;
}

async function parseAssignationForTeacherView(instance) {
  const parsedDates = parseDates(instance.dates, ['start', 'deadline']);
  const classData = await getClassData(instance.classes);
  const studentsStatus = getStudentsStatusForTeacher(instance);
  const status = getTeacherStatus(instance);

  return {
    ...instance,
    parsedDates: {
      deadline: '-',
      ...parsedDates,
    },
    status,
    subject: classData.name,
    ...studentsStatus,
    actions: <TeacherActions id={instance.id} />,
  };
}

async function parseAssignationForStudentView(assignation) {
  const labels = {
    notSubmitted: 'Not submitted',
  };
  const { instance } = assignation;
  const parsedDates = parseDates(instance.dates);
  const status = getStatus(assignation, instance);
  const classData = await getClassData(instance.classes);
  const timeReference = dayjs(instance.dates.deadline).diff(dayjs(), 'seconds');
  const timeReferenceColor = getTimeReferenceColor(instance.dates.deadline);
  const role = instance.assignable.roleDetails;

  return {
    ...instance,
    parsedDates: {
      start: '-',
      deadline: '-',
      ...parsedDates,
    },
    status,
    subject: classData.name,
    actions: (
      <StudentActions
        user={assignation.user}
        late={instance.dates.deadline && timeReference <= 0}
        submitted={instance.dates.end}
        id={instance.id}
        role={role}
      />
    ),
    timeReference:
      !instance.dates.deadline || instance.dates.end ? (
        '-'
      ) : (
        <Text color={timeReferenceColor}>
          {timeReference < 0 ? (
            labels.notSubmitted
          ) : (
            <LocaleRelativeTime seconds={Math.abs(timeReference)} short />
          )}
        </Text>
      ),
  };
}

function parseAssignations({ assignations, parserToUse }) {
  if (!assignations.length) {
    return [];
  }

  return Promise.all(assignations?.map(parserToUse));
}

export default function useParseAssignations(assignations) {
  const { isTeacher } = useContext(globalContext);

  const parserToUse = useMemo(
    () => (isTeacher ? parseAssignationForTeacherView : parseAssignationForStudentView),
    [isTeacher]
  );

  const options = useMemo(
    () => ({
      parserToUse,
      assignations,
    }),
    [parserToUse, assignations]
  );

  const defaultValue = useMemo(() => [], []);

  const [parsedAssignations, , loading] = useApi(parseAssignations, options);

  return [parsedAssignations || defaultValue, loading];
}

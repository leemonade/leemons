import React, { useMemo, useContext } from 'react';
import _, { assign } from 'lodash';
import useIsTeacher from './useIsTeacher';
import { LocaleDate, LocaleDuration, useApi } from '@common';
import getClassData from '../../../../../src/helpers/getClassData';
import globalContext from '../../../../contexts/globalContext';
import { Badge, Text, ContextContainer } from '@bubbles-ui/components';
import { day } from 'date-arithmetic';
import dayjs from 'dayjs';
import getStatus from '../../../Details/components/UsersList/helpers/getStatus';

function parseDates(dates, keysToParse) {
  let datesToParse = dates;

  if (keysToParse?.length) {
    datesToParse = _.pick(dates, keysToParse);
  }

  return _.mapValues(dates, (date) => (
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
        <Badge severity={severity} label={percentage + '%'} closable={false} radius="default " />
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
  } else if (deadline.isSame(today) || deadline.isBefore(today)) {
    return 'Completed';
  } else if (start.isSame(today) || start.isBefore(today)) {
    return 'Started';
  } else {
    return 'Assigned';
  }
}

function getTimeReferenceColor(date) {
  const timeReference = dayjs().diff(dayjs(date), 'days');
  if (timeReference < 2) {
    return 'error';
  } else if (timeReference < 5) {
    return 'warning';
  } else {
    return 'primary';
  }
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
  };
}

async function parseAssignationForStudentView(assignation) {
  const instance = assignation.instance;
  const parsedDates = parseDates(instance.dates);
  const status = getStatus(assignation, instance);
  const classData = await getClassData(instance.classes);
  const timeReference = dayjs().diff(dayjs(instance.dates.deadline), 'seconds');
  const timeReferenceColor = getTimeReferenceColor(instance.dates.deadline);

  return {
    ...instance,
    parsedDates: {
      start: '-',
      deadline: '-',
      ...parsedDates,
    },
    status,
    subject: classData.name,
    timeReference:
      !instance.dates.deadline || instance.dates.end ? (
        '-'
      ) : (
        <Text color={timeReferenceColor}>
          {timeReference < 0 && '-'}
          <LocaleDuration seconds={Math.abs(timeReference)} short />
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

  const [parsedAssignations] = useApi(parseAssignations, options);

  return parsedAssignations || defaultValue;
}

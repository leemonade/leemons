import React, { useMemo, useContext, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import _ from 'lodash';
import { LocaleDate, LocaleRelativeTime, useApi, unflatten } from '@common';
import { Badge, Text, ContextContainer, ActionButton, Button } from '@bubbles-ui/components';
import { ViewOnIcon, ViewOffIcon } from '@bubbles-ui/icons/outline';
import dayjs from 'dayjs';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
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

  const now = dayjs();
  const visualization = dayjs(dates?.visualization);
  const start = dayjs(dates?.start);
  const alwaysAvailable = !(dates?.start && dates?.deadline);

  const redirectToInstance = useCallback(() => history.push(activityUrl), [history, activityUrl]);
  const redirectToRevision = useCallback(() => history.push(revisionUrl), [history, revisionUrl]);

  // TRANSLATE: Translate buttons
  if (finished) {
    const hasCorrections = assignation?.grades
      ?.filter((grade) => grade.type === 'main')
      .some((grade) => grade.visibleToStudent);
    if (hasCorrections) {
      return <Button onClick={redirectToRevision}>{labels?.student_actions?.correction}</Button>;
    }
    return null;
  }

  if (alwaysAvailable) {
    if (timestamps?.start) {
      return <Button onClick={redirectToInstance}>{labels?.student_actions?.continue}</Button>;
    }
    // Start <= x < Deadline
    return <Button onClick={redirectToInstance}>{labels?.student_actions?.start}</Button>;
  }
  // Visualization <= x < Start
  if (!now.isBefore(visualization) && visualization.isValid() && now.isBefore(start)) {
    return <Button onClick={redirectToInstance}>{labels?.student_actions?.view}</Button>;
  }
  if (!now.isBefore(start) && start.isValid()) {
    if (timestamps?.start) {
      return <Button onClick={redirectToInstance}>{labels?.student_actions?.continue}</Button>;
    }
    // Start <= x < Deadline
    return <Button onClick={redirectToInstance}>{labels?.student_actions?.start}</Button>;
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
    actions: <TeacherActions id={instance.id} />,
  };
}

async function parseAssignationForStudentView(assignation, labels) {
  const { instance } = assignation;
  const parsedDates = parseDates(instance.dates);
  const status = labels?.activity_status?.[getStatus(assignation, instance)];
  const classData = await getClassData(instance.classes);
  const timeReference = dayjs(instance.dates.deadline).diff(dayjs(), 'seconds');
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
  ]);

  const labels = useMemo(() => {
    if (translations && translations.items) {
      const res = unflatten(translations.items);
      const data = {
        student_actions: _.get(res, prefixPN('student_actions')),
        activity_status: _.get(res, prefixPN('activity_status')),
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

import React, { useMemo } from 'react';
import _ from 'lodash';
import useIsTeacher from './useIsTeacher';
import { LocaleDate, LocaleDuration, useApi } from '@common';
import getClassData from '../../../../../src/helpers/getClassData';

function parseDates(dates) {
  return _.mapValues(dates, (date) => (
    <LocaleDate date={date} options={{ dateStyle: 'short', timeStyle: 'short' }} />
  ));
}

async function parseAssignationForStudentView(assignation) {
  const parsedDates = parseDates(assignation.dates);
  const classData = await getClassData(assignation.classes);
  return {
    ...assignation,
    parsedDates: {
      start: '-',
      deadline: '-',
      ...parsedDates,
    },
    status: 'TBD',
    subject: classData.name,
  };
}

async function parseAssignationForTeacherView(assignation) {
  const parsedDates = parseDates(assignation.dates);
  const classData = await getClassData(assignation.classes);
  return {
    ...assignation,
    parsedDates: {
      start: '-',
      deadline: '-',
      ...parsedDates,
    },
    status: 'TBD',
    subject: classData.name,
  };
}

function parseAssignations({ assignations, parserToUse }) {
  if (!assignations.length) {
    return [];
  }

  return Promise.all(assignations?.map(parserToUse));
}

export default function useParseAssignations(assignations) {
  const isTeacher = useIsTeacher(assignations);

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

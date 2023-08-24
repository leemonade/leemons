import React, { useMemo } from 'react';
import _ from 'lodash';
import { hashObject, unflatten } from '@common';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { useQuery } from '@tanstack/react-query';
import { useIsTeacher } from '@academic-portfolio/hooks';
import { useVariantForQueryKey } from '@common/queries';
import prefixPN from '@assignables/helpers/prefixPN';
import { parseAssignationForTeacherView } from './parseAssignationForTeacher';
import { parseAssignationForStudentView } from './parseAssignationForStudent';

function parseAssignations({ assignations, isTeacher, labels, options }) {
  const parserToUse = isTeacher ? parseAssignationForTeacherView : parseAssignationForStudentView;

  if (!assignations.length) {
    return [];
  }

  return Promise.all(assignations?.map((assignation) => parserToUse(assignation, labels, options)));
}

function useParseAssignationsLocalizations() {
  const [, translations] = useTranslateLoader([
    prefixPN('student_actions'),
    prefixPN('activity_status'),
    prefixPN('multiSubject'),
    prefixPN('activities_list'),
  ]);

  const labels = useMemo(() => {
    if (translations && translations.items) {
      const res = unflatten(translations.items);
      const data = {
        student_actions: _.get(res, prefixPN('student_actions')),
        activity_status: _.get(res, prefixPN('activity_status')),
        multiSubject: _.get(res, prefixPN('multiSubject')),
        activitiesList: _.get(res, prefixPN('activities_list')),
      };

      return data;
    }

    return {};
  }, [translations]);

  return labels;
}

export default function useParseAssignations(assignations, options) {
  const isTeacher = useIsTeacher();

  const labels = useParseAssignationsLocalizations();

  const queryKey = [
    {
      plugin: 'assignables',
      scope: 'heavy calculations',
      action: 'parse',
      entity: 'assignations',
    },
  ];

  useVariantForQueryKey(queryKey, {
    modificationTrend: 'occasionally',
  });

  const result = useQuery(
    [
      {
        ...queryKey[0],

        isTeacher,
        assignations: hashObject(assignations),
        labels: hashObject(labels),
        options: {
          ...options,
          blockingActivities: hashObject(options.blockingActivities),
        },
      },
    ],
    () =>
      parseAssignations({
        assignations,
        labels,
        options,
        isTeacher,
      })
  );

  return result;
}

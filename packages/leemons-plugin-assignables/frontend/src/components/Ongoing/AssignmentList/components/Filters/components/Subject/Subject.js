/* eslint-disable react/display-name */
import { SelectSubject } from '@academic-portfolio/components/SelectSubject';
import { useIsStudent, useSessionClasses } from '@academic-portfolio/hooks';
import { getMultiClassData } from '@assignables/helpers/getClassData';
import prefixPN from '@assignables/helpers/prefixPN';
import { unflatten } from '@common';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { getSessionConfig } from '@users/session';
import _ from 'lodash';
import React from 'react';

function useSubjectGroupsLocalizations() {
  const [, translations] = useTranslateLoader(prefixPN('assetListFilters.subjectGroups'));

  return React.useMemo(() => {
    if (translations && translations.items) {
      const res = unflatten(translations.items);
      const data = _.get(res, prefixPN('assetListFilters.subjectGroups'));

      return data;
    }

    return {};
  }, [translations]);
}

function useSubjects({ labels }) {
  const localizations = useSubjectGroupsLocalizations();
  const isStudent = useIsStudent();

  let selectedProgram = 'all';
  if (isStudent) {
    const sessionConfig = getSessionConfig();
    selectedProgram = sessionConfig.program;
  }

  const { data: classesData } = useSessionClasses({
    showType: true,
    program: selectedProgram === 'all' ? undefined : selectedProgram,
  });
  const multiClassData = getMultiClassData();

  return React.useMemo(() => {
    if (!classesData?.length) {
      return [];
    }

    const subjects = {};

    classesData.forEach((klass) => {
      if (!subjects[klass.subject.id]) {
        subjects[klass.subject.id] = {
          label: klass.subject.name,
          value: klass.subject.id,
          color: klass.color,
          icon: klass.subject.icon,
          type: klass.type,
        };
      } else if (
        subjects[klass.subject.id].type !== 'main-teacher' &&
        klass.type === 'main-teacher'
      ) {
        subjects[klass.subject.id].type = 'main-teacher';
      }
    });

    return [
      {
        label: labels?.all,
        value: 'all',
        group: labels?.all,
        icon: multiClassData.icon,
        color: multiClassData.color,
      },
      ...Object.values(subjects).map((subject) => ({
        ...subject,
        group:
          subject.type === 'main-teacher'
            ? localizations?.mySubjects
            : localizations?.collaborations,
      })),
    ];
  }, [classesData, selectedProgram, labels?.all, localizations, multiClassData]);
}

const Subject = React.forwardRef(({ labels, value, onChange }, ref) => {
  const subjects = useSubjects({ labels: { all: labels?.seeAll } });

  return (
    <SelectSubject label={labels?.subject} data={subjects} value={value} onChange={onChange} />
  );
});

export default Subject;

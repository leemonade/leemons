/* eslint-disable react/display-name */
import { SelectSubject } from '@academic-portfolio/components/SelectSubject';
import { useIsStudent, useSessionClasses } from '@academic-portfolio/hooks';
import { getMultiClassData } from '@academic-portfolio/helpers/getClassData';
import prefixPN from '@academic-portfolio/helpers/prefixPN';
import { unflatten } from '@common';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { getSessionConfig } from '@users/session';
import _ from 'lodash';
import React from 'react';

function useSubjectGroupsLocalizations() {
  const [, translations] = useTranslateLoader(prefixPN('assetListFilters.subjectGroups'));

  return React.useMemo(() => {
    if (translations?.items) {
      const res = unflatten(translations.items);
      return _.get(res, prefixPN('assetListFilters.subjectGroups'));
    }

    return {};
  }, [translations]);
}

function useSubjects({ ids = [], disableAllValues = false, labels }) {
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
      if (ids.length && !ids.includes(klass.subject.id)) return null;
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

    const allValuesItem = {
      label: labels?.all,
      value: 'all',
      group: labels?.all,
      icon: multiClassData.icon,
      color: multiClassData.color,
    };

    const results = [];
    if (!disableAllValues) results.push(allValuesItem);

    return [
      ...results,
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

const SubjectSelect = React.forwardRef(
  ({ subjectIds, labels, value, onChange, disableAllValues }) => {
    // TODO: Si labels no viene, usar los labels de academic-portfolio
    const subjects = useSubjects({
      ids: subjectIds,
      labels: { all: labels?.seeAll },
      disableAllValues,
    });

    return (
      <SelectSubject label={labels?.subject} data={subjects} value={value} onChange={onChange} />
    );
  }
);

export { SubjectSelect };
export default SubjectSelect;
